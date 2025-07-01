import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './ProductItem.css';
import { colors } from '../../../styles/colors';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import { getUserId, isAuthenticated } from '../../../services/User/Auth/auth.utils';
import { fetchCartItems } from '../../../store/slices/cartSlice';

// Image Fallback Icon Component
const ImageIcon = () => (
    <svg className="image-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>
);

// Toast notification component
const Toast = ({ message, onClose, showGoToCart, onGoToCart }) => {
    console.log('Toast rendered with:', { message, showGoToCart });
    return (
        <div className="toast-notification">
            <div className="toast-content">
                <span>{message}</span>
                {showGoToCart && (
                    <button 
                        onClick={(e) => {
                            console.log('Go to Cart button clicked in Toast');
                            onGoToCart(e);
                        }} 
                        className="go-to-cart-btn"
                    >
                        Go to Cart
                    </button>
                )}
            </div>
            <button onClick={onClose} className="close-toast">×</button>
        </div>
    );
};

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const [imageError, setImageError] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
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
            
            setToast({
                message: result.message || 'Product added to cart successfully!',
                showGoToCart: true
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            setToast({
                message: error.message || 'Failed to add item to cart. Please try again.',
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
        <div className="product-item" style={{ '--primary-color': colors.primary }}>
            {toast && (
                <Toast 
                    message={toast.message}
                    showGoToCart={toast.showGoToCart}
                    onClose={() => {
                        console.log('Closing toast');
                        setToast(null);
                    }}
                    onGoToCart={handleGoToCart}
                />
            )}
            
            <div className="product-image-container">
                {!imageError && mainImage ? (
                    <img 
                        src={mainImage} 
                        alt={name}
                        className="product-image"
                        onError={() => {
                            console.log('Image load error');
                            setImageError(true);
                        }}
                    />
                ) : (
                    <ImageIcon />
                )}
                {stock <= 5 && stock > 0 && (
                    <span className="badge stock-low">
                        Only {stock} left
                    </span>
                )}
                {stock === 0 && (
                    <span className="badge out-of-stock">
                        Out of Stock
                    </span>
                )}
            </div>
            
            <div className="product-content">
                <div className="product-info">
                    <h3 className="product-name" title={name}>{name}</h3>
                    {rating > 0 && (
                        <div className="product-rating">
                            <div className="rating-stars">
                                <span className="stars" style={{ '--rating': rating }}>★★★★★</span>
                                <span className="rating-value">{rating.toFixed(1)}</span>
                            </div>
                            <span className="review-count">({reviewCount} reviews)</span>
                        </div>
                    )}
                    <p className="product-description" title={description}>
                        {description}
                    </p>
                    
                    {highlights && highlights.length > 0 && (
                        <ul className="product-highlights">
                            {highlights.slice(0, 2).map((highlight, index) => (
                                <li key={index} title={highlight}>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="product-action-section">
                    <div className="product-price-section">
                        {priceTiers && priceTiers.length > 0 ? (
                            <div className="price-tiers">
                                {priceTiers.slice(0, 1).map((tier, index) => (
                                    <div key={index} className="price-tier">
                                        <span className="tier-price">₹{tier.price.toLocaleString()}</span>
                                        <span className="tier-name">{tier.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="product-price">
                                <span className="current-price">₹{price.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        className={`cart-button ${isInCart ? 'in-cart' : ''}`}
                        onClick={isInCart ? handleGoToCart : handleAddToCart}
                        disabled={stock === 0 || loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : isInCart ? (
                            'Go to Cart'
                        ) : (
                            stock === 0 ? 'Out of Stock' : 'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem; 