import React, { useState } from 'react';
import './checkoutproducts.css';
import blood from '../assets/blood test.jpg';
import { Link } from 'react-router-dom';

function CheckoutProducts() {
    const [quantity, setQuantity] = useState(1);

    const product = {
        name: "Blood Tester",
        price: 150,
        gst: 27,
        deliveryCost: 15,
        discount: 5, // 5% discount
        image: blood
        };

    const total = ((product.price + product.gst + product.deliveryCost) * (1 - product.discount / 100)).toFixed(2);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-content">
                <div className="checkout-items">
                    <div className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>Price: ₹{product.price}</p>
                            <div className="quantity">
                                <label htmlFor="quantity">Quantity:</label>
                                <input 
                                    type="number" 
                                    id="quantity" 
                                    value={quantity} 
                                    min="1" 
                                    onChange={handleQuantityChange} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Price</span>
                            <span>₹{product.price}</span>
                        </div>
                        <div className="summary-row">
                            <span>GST</span>
                            <span>₹{product.gst}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Cost</span>
                            <span>₹{product.deliveryCost}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount</span>
                            <span>{product.discount}%</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    <Link to='/gateway'>
                    <button className="checkout-button">Checkout</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CheckoutProducts;
