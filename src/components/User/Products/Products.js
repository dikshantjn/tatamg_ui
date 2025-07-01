import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Products.css';
import { productCategories } from './ProductCategories';
import { colors } from '../../../styles/colors';
import TopOfferStrip from '../../TopOfferStrip';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import ProductItem from './ProductItem';

// Import actual images from assets
import otc from '../../../assets/otc.jpg';
import wearable from '../../../assets/wearable.jpg';
import nonwearable from '../../../assets/nonwearable.jpg';
import bloodTest from '../../../assets/blood test.jpg';
import ambulance from '../../../assets/ambulance.jpg';
import drops from '../../../assets/drops.jpg';
import consult from '../../../assets/consult.jpg';
import instant from '../../../assets/instant.jpg';
import physio from '../../../assets/physio.jpg';
import dentist from '../../../assets/dentist.jpg';
import surgeon from '../../../assets/surgeon.jpg';
import phsiotherapist from '../../../assets/phsiotherapist.jpg';

// Enhanced Loading Components
const CircularLoader = () => (
    <div className="circular-loader">
        <div className="spinner-ring"></div>
        <div className="spinner-text">Loading...</div>
    </div>
);

const ProductCardSkeleton = () => (
    <div className="product-box skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-button"></div>
        </div>
    </div>
);

// Enhanced Category color mapping with gradients
const categoryColors = {
    'Dental Care': { bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '#1976D2' },
    'Genetic Testing': { bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '#388E3C' },
    'Heart Care': { bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', icon: '#D32F2F' },
    'Baby Care': { bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', icon: '#7B1FA2' },
    'Elder Care': { bg: 'linear-gradient(135deg, #FFF3E0, #FFCC02)', icon: '#F57C00' },
    'Women Care': { bg: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)', icon: '#C2185B' },
    'Digital Health Tracker': { bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', icon: '#0097A7' },
    'Digital Health Ring': { bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '#388E3C' },
    'Epilepsy Care': { bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '#1976D2' },
    'UTI Test Kit': { bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', icon: '#7B1FA2' },
    'Wellness Care Kit': { bg: 'linear-gradient(135deg, #FFF3E0, #FFCC02)', icon: '#F57C00' },
    'Pregnancy Care': { bg: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)', icon: '#C2185B' },
    'Wound Care': { bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', icon: '#0097A7' },
    'Portable ECG': { bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', icon: '#388E3C' },
    'Period Care': { bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', icon: '#7B1FA2' },
    default: { bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', icon: '#1976D2' }
};

// Enhanced Geometric Shape Component with animations
const GeometricShapes = ({ type }) => {
    const shapes = {
        popular: [
            { className: 'shape-1 shape-circle', background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', animation: 'float 6s ease-in-out infinite' },
            { className: 'shape-2 shape-square', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', animation: 'float 6s ease-in-out infinite 2s' },
            { className: 'shape-3 shape-triangle', background: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', animation: 'float 6s ease-in-out infinite 4s' }
        ],
        electronic: [
            { className: 'shape-1 shape-square', background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', animation: 'float 6s ease-in-out infinite' },
            { className: 'shape-2 shape-triangle', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', animation: 'float 6s ease-in-out infinite 2s' },
            { className: 'shape-3 shape-circle', background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', animation: 'float 6s ease-in-out infinite 4s' }
        ],
        featured: [
            { className: 'shape-1 shape-triangle', background: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', animation: 'float 6s ease-in-out infinite' },
            { className: 'shape-2 shape-circle', background: 'linear-gradient(135deg, #FFF3E0, #FFCC02)', animation: 'float 6s ease-in-out infinite 2s' },
            { className: 'shape-3 shape-square', background: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)', animation: 'float 6s ease-in-out infinite 4s' }
        ],
        personal: [
            { className: 'shape-1 shape-square', background: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)', animation: 'float 6s ease-in-out infinite' },
            { className: 'shape-2 shape-circle', background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', animation: 'float 6s ease-in-out infinite 2s' },
            { className: 'shape-3 shape-triangle', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', animation: 'float 6s ease-in-out infinite 4s' }
        ]
    };

    return (
        <>
            {shapes[type].map((shape, index) => (
                <div 
                    key={index} 
                    className={`section-shape ${shape.className}`}
                    style={{ 
                        background: shape.background,
                        animation: shape.animation
                    }}
                />
            ))}
        </>
    );
};

// Enhanced Category Box Component
const CategoryBox = ({ category, onClick }) => {
    const navigate = useNavigate();
    const categoryStyle = categoryColors[category.name] || categoryColors.default;

    const handleClick = () => {
        navigate(`/products/${encodeURIComponent(category.name)}`);
    };

    return (
        <div 
            className="category-box" 
            onClick={handleClick}
            style={{ '--category-bg': categoryStyle.bg }}
        >
            <div className="category-icon-wrapper" style={{ background: categoryStyle.bg }}>
                <category.icon size={28} style={{ color: categoryStyle.icon }} />
            </div>
            <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.subCategories.length} items available</p>
                <div className="category-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>
            <div className="category-overlay"></div>
        </div>
    );
};

// Enhanced Product Box Component
const ProductBox = ({ product }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <div 
            className="product-box" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container">
                {imageLoading && <CircularLoader />}
                {imageError ? (
                    <div className="image-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
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
                    <button className="add-to-cart-overlay-btn">Add to Cart</button>
                </div>
                {product.prescription && (
                    <span className="badge prescription">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        Prescription Required
                    </span>
                )}
                {product.stock === 'low' && (
                    <span className="badge stock-low">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Low Stock
                    </span>
                )}
                {product.stock === 'out' && (
                    <span className="badge out-of-stock">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        Out of Stock
                    </span>
                )}
                {product.discount > 0 && (
                    <span className="badge discount">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 14l6-6"/>
                            <circle cx="6" cy="6" r="3"/>
                            <circle cx="18" cy="18" r="3"/>
                        </svg>
                        {product.discount}% OFF
                    </span>
                )}
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
                >
                    {product.stock === 'out' ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            Out of Stock
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                                <path d="M12 21c0-1-1-2-2-2s-2 1-2 2 1 2 2 2 2-1 2-2z"/>
                                <path d="M12 3c0 1 1 2 2 2s2-1 2-2-1-2-2-2-2 1-2 2z"/>
                            </svg>
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Enhanced Offer Banner Component
const OfferBanner = ({ title, subtitle, ctaText, bgColor, textColor, icon }) => (
    <div className="offer-banner" style={{ 
        background: bgColor || colors.primaryGradient,
        color: textColor || colors.backgroundWhite
    }}>
        <div className="offer-content">
            <div className="offer-text">
                {icon && <div className="offer-icon">{icon}</div>}
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            <button className="offer-cta">
                {ctaText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
        <div className="offer-shapes">
            <div className="offer-shape circle"></div>
            <div className="offer-shape square"></div>
            <div className="offer-shape triangle"></div>
        </div>
    </div>
);

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(false);
    const [showPersonalLeftScroll, setShowPersonalLeftScroll] = useState(false);
    const [showPersonalRightScroll, setShowPersonalRightScroll] = useState(false);
    
    const popularCategoriesRef = useRef(null);
    const personalCareRef = useRef(null);

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

    // Check scroll position for popular categories
    const checkScroll = () => {
        if (popularCategoriesRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = popularCategoriesRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Check scroll position for personal care categories
    const checkPersonalScroll = () => {
        if (personalCareRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = personalCareRef.current;
            setShowPersonalLeftScroll(scrollLeft > 0);
            setShowPersonalRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
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

    // Handle scroll for personal care categories
    const handlePersonalScroll = (direction) => {
        if (personalCareRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            personalCareRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Add scroll event listeners
    useEffect(() => {
        const popularRef = popularCategoriesRef.current;
        const personalRef = personalCareRef.current;
        
        if (popularRef) {
            popularRef.addEventListener('scroll', checkScroll);
            checkScroll();
        }
        
        if (personalRef) {
            personalRef.addEventListener('scroll', checkPersonalScroll);
            checkPersonalScroll();
        }
        
        window.addEventListener('resize', () => {
            checkScroll();
            checkPersonalScroll();
        });
        
        return () => {
            if (popularRef) {
                popularRef.removeEventListener('scroll', checkScroll);
            }
            if (personalRef) {
                personalRef.removeEventListener('scroll', checkPersonalScroll);
            }
            window.removeEventListener('resize', () => {
                checkScroll();
                checkPersonalScroll();
            });
        };
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
                    <div className="section-title">
                        <h2>Popular Categories</h2>
                        <p>Explore our most sought-after health categories</p>
                    </div>
                    <Link to="/categories" className="view-all-link">
                        View All Categories
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14"/>
                            <path d="M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="categories-container">
                    {showLeftScroll && (
                        <button 
                            className="scroll-button left"
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <div className="section-title">
                        <h2>Electronic Health Devices</h2>
                        <p>Smart devices for modern healthcare</p>
                    </div>
                    <Link to="/electronics" className="view-all-link">
                        View All Electronics
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14"/>
                            <path d="M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
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
                    <div className="section-title">
                        <h2>{activeCategory === 'all' ? 'Featured Products' : activeCategory}</h2>
                        <p>Handpicked products for your health and wellness</p>
                    </div>
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <h3>No products found</h3>
                            <p>We couldn't find any products in this category. Try browsing other categories.</p>
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
                    <div className="section-title">
                        <h2>Personal Care</h2>
                        <p>Essential products for daily wellness</p>
                    </div>
                    <Link to="/personal-care" className="view-all-link">
                        View All Care Products
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14"/>
                            <path d="M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="categories-container">
                    {showPersonalLeftScroll && (
                        <button 
                            className="scroll-button left"
                            onClick={() => handlePersonalScroll('left')}
                            aria-label="Scroll left"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    )}
                    <div className="categories-grid" ref={personalCareRef}>
                        {personalCareCategories.map((category, index) => (
                            <CategoryBox 
                                key={index} 
                                category={category}
                            />
                        ))}
                    </div>
                    {showPersonalRightScroll && (
                        <button 
                            className="scroll-button right"
                            onClick={() => handlePersonalScroll('right')}
                            aria-label="Scroll right"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Products; 