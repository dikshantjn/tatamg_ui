import React from 'react';
import './checkoutambulance.css';

function CheckoutAmbulance() {
    const ambulance = {
        type: "Basic Life Support",
        price: 1500,
        gst: 270,
        discount: 5, // 5% discount
        image: "https://via.placeholder.com/150" // Placeholder ambulance image
    };

    const total = ((ambulance.price + ambulance.gst) * (1 - ambulance.discount / 100)).toFixed(2);

    return (
        <div className="checkout-container">
            <h2>Ambulance Service Checkout</h2>
            <div className="checkout-content">
                <div className="checkout-items">
                    <div className="product-card">
                        <img src={ambulance.image} alt={ambulance.type} className="product-image" />
                        <div className="product-info">
                            <h3>{ambulance.type}</h3>
                            <p>Price: ₹{ambulance.price}</p>
                        </div>
                    </div>
                </div>
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Price</span>
                            <span>₹{ambulance.price}</span>
                        </div>
                        <div className="summary-row">
                            <span>GST</span>
                            <span>₹{ambulance.gst}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount</span>
                            <span>{ambulance.discount}%</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutAmbulance;
