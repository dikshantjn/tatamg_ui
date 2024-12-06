import React, { useEffect, useState } from 'react';
import './Checkout.css';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch cart items from the backend
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/cart/');
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Calculate the total cost
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) return <p>Loading cart items...</p>;
    if (error) return <p>Error loading cart: {error}</p>;

    return (
        <div className="checkout-container">
            <h2>Your Cart</h2>
            <div className="checkout-content">
                <div className="checkout-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.image || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="item-image"
                                />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>Price: ₹{item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (10%)</span>
                                <span>₹{(calculateTotal() * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{(calculateTotal() * 1.1).toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="checkout-button">Checkout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
