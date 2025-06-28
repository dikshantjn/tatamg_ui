import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Products.css';
import { productCategories } from './ProductCategories';
import { colors } from '../styles/colors';
import TopOfferStrip from './TopOfferStrip';
import { VendorProductService } from '../services/vendor-product.service';
import ProductItem from './ProductItem';

// Import actual images from assets
import otc from '../assets/otc.jpg';
import wearable from '../assets/wearable.jpg';
import nonwearable from '../assets/nonwearable.jpg';
import bloodTest from '../assets/blood test.jpg';
import ambulance from '../assets/ambulance.jpg';
import drops from '../assets/drops.jpg';
import consult from '../assets/consult.jpg';
import instant from '../assets/instant.jpg';
import physio from '../assets/physio.jpg';
import dentist from '../assets/dentist.jpg';
import surgeon from '../assets/surgeon.jpg';
import phsiotherapist from '../assets/phsiotherapist.jpg';

// Circular Loading Component
const CircularLoader = () => (
    <div className="circular-loader">
        <div className="spinner"></div>
    </div>
);

// Skeleton Loading Component
const ProductCardSkeleton = () => (
    <div className="product-box skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-button"></div>
        </div>
    </div>
);

// Category color mapping
const categoryColors = {
    'Dental Care': '#E3F2FD',
    'Genetic Testing': '#E8F5E9',
    'Heart Care': '#FFEBEE',
    'Baby Care': '#F3E5F5',
    'Elder Care': '#FFF3E0',
    'Women Care': '#FCE4EC',
    'Digital Health Tracker': '#E0F7FA',
    'Digital Health Ring': '#E8F5E9',
    'Epilepsy Care': '#E3F2FD',
    'UTI Test Kit': '#F3E5F5',
    'Wellness Care Kit': '#FFF3E0',
    'Pregnancy Care': '#FCE4EC',
    'Wound Care': '#E0F7FA',
    'Portable ECG': '#E8F5E9',
    'Period Care': '#F3E5F5',
    default: '#E3F2FD'
};

// Geometric Shape Component
const GeometricShapes = ({ type }) => {
    const shapes = {
        popular: [
            { className: 'shape-1 shape-circle', background: '#E3F2FD' },
            { className: 'shape-2 shape-square', background: '#E8F5E9' },
            { className: 'shape-3 shape-triangle', background: '#FFEBEE' }
        ],
        electronic: [
            { className: 'shape-1 shape-square', background: '#E0F7FA' },
            { className: 'shape-2 shape-triangle', background: '#E8F5E9' },
            { className: 'shape-3 shape-circle', background: '#E3F2FD' }
        ],
        featured: [
            { className: 'shape-1 shape-triangle', background: '#F3E5F5' },
            { className: 'shape-2 shape-circle', background: '#FFF3E0' },
            { className: 'shape-3 shape-square', background: '#FCE4EC' }
        ],
        personal: [
            { className: 'shape-1 shape-square', background: '#FCE4EC' },
            { className: 'shape-2 shape-circle', background: '#E0F7FA' },
            { className: 'shape-3 shape-triangle', background: '#E8F5E9' }
        ]
    };

    return (
        <>
            {shapes[type].map((shape, index) => (
                <div 
                    key={index} 
                    className={`section-shape ${shape.className}`}
                    style={{ background: shape.background }}
                />
            ))}
        </>
    );
};

// Category Box Component
const CategoryBox = ({ category, onClick }) => {
    const navigate = useNavigate();
    const backgroundColor = categoryColors[category.name] || categoryColors.default;

    const handleClick = () => {
        navigate(`/products/${encodeURIComponent(category.name)}`);
    };

    return (
        <div 
            className="category-box" 
            onClick={handleClick}
            style={{ '--category-color': backgroundColor }}
        >
            <div className="category-icon-wrapper" style={{ background: backgroundColor }}>
                <category.icon size={24} style={{ color: category.name.toLowerCase().includes('care') ? '#FF6B6B' : '#38A3A5' }} />
            </div>
            <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.subCategories.length} items</p>
            </div>
        </div>
    );
};

// Product Box Component with Image Loading
const ProductBox = ({ product }) => {
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
        <div className="product-box">
            <div className="product-image-container">
                {imageLoading && <CircularLoader />}
                {imageError ? (
                    <div className="image-placeholder">
                        <span>Image not available</span>
                    </div>
                ) : (
                    <img 
                        src={product.image} 
                        alt={product.name}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ opacity: imageLoading ? 0 : 1 }}
                    />
                )}
                <div className="product-overlay">
                    <button className="quick-view-btn">Quick View</button>
                </div>
                {product.prescription && <span className="badge prescription" style={{ backgroundColor: colors.error }}>
                    Prescription Required
                </span>}
                {product.stock === 'low' && <span className="badge stock-low" style={{ backgroundColor: '#F59E0B' }}>
                    Low Stock
                </span>}
                {product.stock === 'out' && <span className="badge out-of-stock" style={{ backgroundColor: colors.textSecondary }}>
                    Out of Stock
                </span>}
                {product.discount > 0 && <span className="badge discount" style={{ backgroundColor: colors.success }}>
                    {product.discount}% OFF
                </span>}
            </div>
            <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price-section">
                    <div className="product-price">
                        <span className="current-price">₹{product.currentPrice.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    {product.discount > 0 && (
                        <span className="discount-percentage">Save {product.discount}%</span>
                    )}
                </div>
                <button 
                    className="add-to-cart-btn" 
                    disabled={product.stock === 'out'}
                    style={{
                        background: product.stock === 'out' ? colors.textSecondary : colors.primaryGradient
                    }}
                >
                    {product.stock === 'out' ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

// Offer Banner Component
const OfferBanner = ({ title, subtitle, ctaText, bgColor, textColor }) => (
    <div className="offer-banner" style={{ 
        background: bgColor || colors.primaryGradient,
        color: textColor || colors.backgroundWhite
    }}>
        <div className="offer-content">
            <div className="offer-text">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            <button className="offer-cta">{ctaText}</button>
        </div>
    </div>
);

function Products() {
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [products, setProducts] = useState([]);
    const popularCategoriesRef = useRef(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);

    // Fetch products when category changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (activeCategory !== 'all') {
                    const fetchedProducts = await VendorProductService.getProductsByCategory(activeCategory);
                    setProducts(fetchedProducts);
                } else {
                    // You might want to implement a get all products endpoint
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                // You might want to show an error message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    // Check scroll position for popular categories
    const checkScroll = () => {
        if (popularCategoriesRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = popularCategoriesRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Handle scroll for popular categories
    const handleScroll = (direction) => {
        if (popularCategoriesRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            popularCategoriesRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const currentRef = popularCategoriesRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScroll);
            checkScroll(); // Initial check
            
            // Check on window resize
            window.addEventListener('resize', checkScroll);
            
            return () => {
                currentRef.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
    };

    // Sample product data with actual images
    const sampleProducts = [
        {
            id: 1,
            name: "Digital Blood Pressure Monitor",
            description: "Accurate readings with memory function",
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
            description: "24/7 health monitoring with GPS",
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
            description: "For chronic condition management",
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
            description: "Professional grade heart monitoring",
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
            description: "Monitor oxygen saturation levels",
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
            description: "Professional rehabilitation tools",
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
            description: "Complete oral hygiene solution",
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

    return (
        <div className="products-page">
            <TopOfferStrip />

            {/* Popular Categories */}
            <section className="categories-section popular">
                <GeometricShapes type="popular" />
                <div className="section-header">
                    <h2>Popular Categories</h2>
                    <Link to="/categories" className="view-all-link">View All Categories</Link>
                </div>
                <div className="categories-container">
                    {showLeftScroll && (
                        <button 
                            className="scroll-button left"
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    )}
                    <div className="categories-grid" ref={popularCategoriesRef}>
                        {popularCategories.map((category, index) => (
                            <CategoryBox 
                                key={index} 
                                category={category}
                            />
                        ))}
                    </div>
                    {showRightScroll && (
                        <button 
                            className="scroll-button right"
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    )}
                </div>
            </section>

            {/* Offer Banner */}
            <OfferBanner 
                title="Flash Sale: Health Monitors"
                subtitle="Get up to 40% off on premium health monitoring devices"
                ctaText="Shop Now"
                bgColor="linear-gradient(135deg, #FF6B6B, #FF8787)"
            />

            {/* Electronic Categories */}
            <section className="categories-section electronic">
                <GeometricShapes type="electronic" />
                <div className="section-header">
                    <h2>Electronic Health Devices</h2>
                    <Link to="/electronics" className="view-all-link">View All Electronics</Link>
                </div>
                <div className="categories-grid">
                    {electronicCategories.map((category, index) => (
                        <CategoryBox 
                            key={index} 
                            category={category}
                        />
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <GeometricShapes type="featured" />
                <div className="section-header">
                    <h2>{activeCategory === 'all' ? 'Featured Products' : activeCategory}</h2>
                </div>
                <div className="products-grid">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductItem key={product.productId} product={product} />
                        ))
                    ) : (
                        <div className="no-products-message">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Second Offer Banner */}
            <OfferBanner 
                title="Personal Care Essentials"
                subtitle="Complete your daily health routine with our curated collection"
                ctaText="Explore Now"
                bgColor="linear-gradient(135deg, #4ECDC4, #2ECC71)"
            />

            {/* Personal Care Categories */}
            <section className="categories-section personal">
                <GeometricShapes type="personal" />
                <div className="section-header">
                    <h2>Personal Care</h2>
                    <Link to="/personal-care" className="view-all-link">View All Care Products</Link>
                </div>
                <div className="categories-grid">
                    {personalCareCategories.map((category, index) => (
                        <CategoryBox 
                            key={index} 
                            category={category}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Products;
