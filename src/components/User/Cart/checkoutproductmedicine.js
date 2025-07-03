import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { colors } from '../../../styles/colors';
import { VendorProductService } from '../../../services/User/Products/vendor-product.service';
import { getUserId, isAuthenticated } from '../../../services/User/Auth/auth.utils';
import './checkoutproductmedicine.css';
import CheckoutProductModal from './CheckoutProductModal';
import { fetchCartItems } from '../../../store/slices/cartSlice';
import { getUserOrdersWithCart } from '../../../services/User/MedicineDelivery/medicine-delivery.service';
import CheckoutMedicineModal from './CheckoutMedicineModal';

// Image Fallback Icon Component
const ImageIcon = () => (
    <svg 
        className="image-fallback" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={colors.primary}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>
);

// Loading Skeleton Component
const CartItemSkeleton = () => (
    <div className="cart-item-skeleton">
        <div className="image-skeleton"></div>
        <div className="content-skeleton">
            <div className="title-skeleton"></div>
            <div className="price-skeleton"></div>
        </div>
    </div>
);

// Tab Component
const TabButton = ({ active, children, onClick }) => (
    <button 
        className={`tab-button ${active ? 'active' : ''}`}
        onClick={onClick}
        style={{
            background: active ? colors.primary : 'transparent',
            color: active ? '#fff' : colors.primary,
            border: `2px solid ${colors.primary}`
        }}
    >
        {children}
    </button>
);

function CheckoutProducts() {
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'medicine'
    const [notification, setNotification] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const navigate = useNavigate();
    const [medicineOrders, setMedicineOrders] = useState([]);
    const [loadingMedicine, setLoadingMedicine] = useState(true);
    const [medicineError, setMedicineError] = useState(null);
    const [medicineItemCount, setMedicineItemCount] = useState(0);
    const [productItemCount, setProductItemCount] = useState(0);
    const [showMedicineCheckoutModal, setShowMedicineCheckoutModal] = useState(false);
    const [medicineCheckoutOrderData, setMedicineCheckoutOrderData] = useState(null);

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            const userId = getUserId();
            if (!userId || !isAuthenticated()) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                const items = await VendorProductService.getCartItems(userId);
                setCartItems(items);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
                setError('Failed to load your cart items. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [navigate]);

    useEffect(() => {
        // Fetch medicine orders on mount for immediate count
        const fetchMedicineOrders = async () => {
            const userId = getUserId();
            if (!userId || !isAuthenticated()) return;
            try {
                setLoadingMedicine(true);
                const orders = await getUserOrdersWithCart(userId);
                setMedicineOrders(orders);
                setMedicineError(null);
            } catch (error) {
                setMedicineError('Failed to load your medicine orders. Please try again.');
            } finally {
                setLoadingMedicine(false);
            }
        };
        fetchMedicineOrders();
    }, []);

    useEffect(() => {
        if (activeTab === 'medicine') {
            // Optionally re-fetch on tab switch if you want fresh data
            // fetchMedicineOrders();
        }
    }, [activeTab]);

    useEffect(() => {
        // Initialize product item count
        setProductItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    }, [cartItems]);

    useEffect(() => {
        // Initialize medicine item count
        setMedicineItemCount(medicineOrders.reduce((sum, order) => sum + (order.Carts ? order.Carts.length : 0), 0));
    }, [medicineOrders]);

    const handleQuantityChange = async (cartId, newQuantity) => {
        try {
            await VendorProductService.updateCartItemQuantity(cartId, newQuantity);
            
            // Update local state
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.cartId === cartId 
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            
            // Dispatch Redux action to refresh cart items in header
            dispatch(fetchCartItems());
            
            showNotification('Quantity updated successfully!');
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showNotification('Failed to update quantity. Please try again.', 'error');
        }
    };

    const handleRemoveItem = async (cartId) => {
        try {
            await VendorProductService.deleteCartItem(cartId);
            
            // Update local state
            setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
            
            // Dispatch Redux action to refresh cart items in header
            dispatch(fetchCartItems());
            
            showNotification('Item removed from cart successfully!');
        } catch (error) {
            console.error('Failed to remove item:', error);
            showNotification('Failed to remove item. Please try again.', 'error');
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const calculateGST = (subtotal) => {
        return subtotal * 0.18; // 18% GST
    };

    const calculateDelivery = () => {
        return cartItems.length > 0 ? 49 : 0; // Fixed delivery charge
    };

    const handleMedicineQuantityChange = async (cartId, newQuantity) => {
        try {
            // You may want to call a medicine-specific update API if needed
            // For now, just update local state for demo
            setMedicineOrders(prevOrders => prevOrders.map(order => ({
                ...order,
                Carts: order.Carts.map(item =>
                    item.cartId === cartId ? { ...item, quantity: newQuantity } : item
                )
            })));
            showNotification('Quantity updated successfully!');
        } catch (error) {
            showNotification('Failed to update quantity. Please try again.', 'error');
        }
    };

    const handleRemoveMedicineItem = (cartId) => {
        setMedicineOrders(prevOrders => {
            const updated = prevOrders.map(order => ({
                ...order,
                Carts: order.Carts.filter(item => item.cartId !== cartId)
            })).filter(order => order.Carts.length > 0);
            // If all orders are empty, show empty cart UI
            if (updated.length === 0) setMedicineItemCount(0);
            return updated;
        });
        showNotification('Item removed from medicine cart!');
    };

    const handleMedicineCheckout = () => {
        // Transform real backend data for modal
        const allCartItems = medicineOrders.flatMap(order =>
            (order.Carts || []).map(item => ({
                ...item,
                orderId: order.orderId, // ensure real backend orderId
                name: item.MedicineProduct?.name || item.name,
                price: item.price,
                quantity: item.quantity,
                // add any other fields needed by modal
            }))
        );
        // Prepare orderData for modal
        const orderData = {
            // No dummy orderId here; grouping will be done in modal
            items: allCartItems,
            deliveryAddress: null, // Will be selected in modal
            subtotal: allCartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
            platformFee: 5.00,
            discount: 0.00,
            deliveryCharge: allCartItems.length > 0 ? 49 : 0,
            total: 0 // Will be calculated in modal
        };
        orderData.total = orderData.subtotal + orderData.platformFee + orderData.deliveryCharge - orderData.discount;
        setMedicineCheckoutOrderData(orderData);
        setShowMedicineCheckoutModal(true);
    };

    const renderProductsTab = () => {
        if (loading) {
            return (
                <div className="tab-content">
                    {[1, 2, 3].map((i) => (
                        <CartItemSkeleton key={i} />
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="tab-content">
                    <div className="error-message">
                        <h3>Oops!</h3>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{ background: colors.primary }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        if (cartItems.length === 0) {
            return (
                <div className="tab-content">
                    <div className="empty-cart">
                        <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke={colors.primary} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ width: 64, height: 64, marginBottom: 16 }}
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added any items yet.</p>
                        <Link 
                            to="/" 
                            className="continue-shopping"
                            style={{ color: colors.primary }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            );
        }

        const subtotal = calculateSubtotal();
        const gst = calculateGST(subtotal);
        const delivery = calculateDelivery();
        const total = subtotal + gst + delivery;

        return (
            <div className="tab-content">
                <div className="checkout-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="cart-item">
                                <div className="item-image">
                                    {item.product.images && item.product.images[0] ? (
                                        <img 
                                            src={item.product.images[0]} 
                                            alt={item.product.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="image-fallback-container" style={{ display: !item.product.images || !item.product.images[0] ? 'flex' : 'none' }}>
                                        <ImageIcon />
                                    </div>
                                </div>
                                <div className="item-details">
                                    <h3>{item.product.name}</h3>
                                    <p className="item-description">{item.product.description}</p>
                                    {item.product.highlights && (
                                        <ul className="item-highlights">
                                            {item.product.highlights.map((highlight, index) => (
                                                <li key={index}>{highlight}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="item-meta">
                                        {item.product.rating > 0 && (
                                            <span className="rating">
                                                ★ {item.product.rating.toFixed(1)} ({item.product.reviewCount})
                                            </span>
                                        )}
                                        {item.product.stock <= 5 && (
                                            <span className="stock-warning">
                                                Only {item.product.stock} left!
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <div className="price">₹{item.product.price.toLocaleString()}</div>
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => handleQuantityChange(item.cartId, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                            style={{ color: colors.primary }}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            style={{ color: colors.primary }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="remove-item"
                                        onClick={() => handleRemoveItem(item.cartId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST (18%)</span>
                                <span>₹{gst.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery</span>
                                <span>₹{delivery.toLocaleString()}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            className="checkout-button"
                            onClick={() => setShowCheckoutModal(true)}
                            style={{ 
                                background: colors.primary,
                                color: '#fff'
                            }}
                        >
                            Proceed to Checkout
                        </button>
                        <Link 
                            to="/" 
                            className="continue-shopping"
                            style={{ color: colors.primary }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const renderMedicineTab = () => {
        if (loadingMedicine) {
            return (
                <div className="tab-content">
                    {[1, 2].map(i => <CartItemSkeleton key={i} />)}
                </div>
            );
        }
        if (medicineError) {
            return (
                <div className="tab-content">
                    <div className="error-message">
                        <h3>Oops!</h3>
                        <p>{medicineError}</p>
                        <button onClick={() => window.location.reload()} style={{ background: colors.primary }}>Try Again</button>
                    </div>
                </div>
            );
        }
        if (!medicineOrders || medicineOrders.length === 0 || medicineItemCount === 0) {
            return (
                <div className="tab-content">
                    <div className="medicine-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 64, height: 64, marginBottom: 16 }}>
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                            <path d="M12 5l-3 3m3-3v6m0-6l3 3"/>
                        </svg>
                        <h3>Medicine Cart</h3>
                        <p>Your medicine cart is currently empty.</p>
                        <p>Add prescription medicines to your cart to see them here.</p>
                        <Link to="/medicine" className="continue-shopping" style={{ color: colors.primary }}>Browse Medicines</Link>
                    </div>
                </div>
            );
        }

        // Flatten all cart items for summary
        const allCartItems = medicineOrders.flatMap(order => order.Carts || []);
        const subtotal = allCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const gst = subtotal * 0.18;
        const delivery = allCartItems.length > 0 ? 49 : 0;
        const total = subtotal + gst + delivery;

        return (
            <div className="tab-content">
                <div className="checkout-content">
                    <div className="cart-items">
                        {medicineOrders.map(order => (
                            <div key={order.orderId} className="medicine-order-item">
                                <div className="medicine-cart-items">
                                    {order.Carts && order.Carts.length > 0 ? order.Carts.map(item => (
                                        <div key={item.cartId} className="item-row medicine-item-row">
                                            <div className="item-info">
                                                <div className="item-image">
                                                    <div className="image-fallback-container" style={{ display: 'flex' }}>
                                                        <ImageIcon />
                                                    </div>
                                                </div>
                                                <span className="item-name">{item.MedicineProduct?.name || item.name}</span>
                                            </div>
                                            <div className="item-details medicine-item-details">
                                                <div className="quantity-controls">
                                                    <button 
                                                        onClick={() => handleMedicineQuantityChange(item.cartId, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                        style={{ color: colors.primary }}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleMedicineQuantityChange(item.cartId, item.quantity + 1)}
                                                        style={{ color: colors.primary }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="item-price">₹{item.price}</span>
                                                <button 
                                                    className="remove-item"
                                                    onClick={() => handleRemoveMedicineItem(item.cartId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )) : <div className="no-cart-items">No items in this order.</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST (18%)</span>
                                <span>₹{gst.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery</span>
                                <span>₹{delivery.toLocaleString()}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            className="checkout-button"
                            onClick={handleMedicineCheckout}
                            style={{ background: colors.primary, color: '#fff' }}
                        >
                            Proceed to Checkout
                        </button>
                        <Link to="/medicine" className="continue-shopping" style={{ color: colors.primary }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="checkout-container">
            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            
            <h2>Your Cart</h2>
            
            {/* Tabs */}
            <div className="tabs-container">
                <div className="tabs">
                    <TabButton 
                        active={activeTab === 'products'} 
                        onClick={() => setActiveTab('products')}
                    >
                        Products ({productItemCount})
                    </TabButton>
                    <TabButton 
                        active={activeTab === 'medicine'} 
                        onClick={() => setActiveTab('medicine')}
                    >
                        Medicine ({medicineItemCount})
                    </TabButton>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'products' ? renderProductsTab() : renderMedicineTab()}
            
            {/* Unified Checkout Modal */}
            <CheckoutProductModal 
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onPayNow={(orderData) => {
                    setShowCheckoutModal(false);
                    navigate('/gateway');
                }}
                orderData={{
                    orderId: 'ORD-' + Date.now(),
                    items: cartItems.map(item => ({
                        id: item.cartId,
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price,
                        image: item.product.images && item.product.images[0] ? item.product.images[0] : null
                    })),
                    deliveryAddress: null, // Will be selected in the modal
                    subtotal: calculateSubtotal(),
                    platformFee: 10.00,
                    discount: 20.00,
                    deliveryCharge: calculateDelivery(),
                    total: calculateSubtotal() + calculateGST(calculateSubtotal()) + calculateDelivery() - 20.00 // Including discount
                }}
            />

            <CheckoutMedicineModal
                isOpen={showMedicineCheckoutModal}
                onClose={() => setShowMedicineCheckoutModal(false)}
                orderData={medicineCheckoutOrderData}
            />
        </div>
    );
}

export default CheckoutProducts;
