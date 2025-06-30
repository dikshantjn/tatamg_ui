import React, { useState, useEffect } from 'react';
import { colors } from '../styles/colors';
import './OrderSummaryModal.css';

const OrderSummaryModal = ({ isOpen, onClose, onPayNow, orderData }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Mock order data - replace with real data from props
    const mockOrderData = {
        orderId: 'ORD-2024-001',
        items: [
            {
                id: 1,
                name: 'Paracetamol 500mg',
                quantity: 2,
                price: 15.00,
                image: '/path/to/image1.jpg'
            },
            {
                id: 2,
                name: 'Vitamin C 1000mg',
                quantity: 1,
                price: 25.00,
                image: '/path/to/image2.jpg'
            },
            {
                id: 3,
                name: 'First Aid Kit',
                quantity: 1,
                price: 150.00,
                image: '/path/to/image3.jpg'
            }
        ],
        deliveryAddress: {
            address: '123 Main Street',
            locality: 'Downtown',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        subtotal: 190.00,
        platformFee: 10.00,
        discount: 20.00,
        deliveryCharge: 30.00,
        total: 210.00
    };

    const orderDataToUse = orderData || mockOrderData;
    
    // Ensure all required properties exist with fallbacks
    const safeOrderData = {
        orderId: orderDataToUse?.orderId || 'ORD-2024-001',
        items: orderDataToUse?.items || [],
        deliveryAddress: orderDataToUse?.deliveryAddress || mockOrderData.deliveryAddress,
        subtotal: orderDataToUse?.subtotal || 190.00,
        platformFee: orderDataToUse?.platformFee || 10.00,
        discount: orderDataToUse?.discount || 20.00,
        deliveryCharge: orderDataToUse?.deliveryCharge || 30.00,
        total: orderDataToUse?.total || 210.00
    };

    const handlePayNow = () => {
        if (onPayNow) {
            onPayNow(safeOrderData);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="order-summary-modal-backdrop" onClick={onClose}></div>
            
            {/* Modal Container */}
            <div className={`order-summary-modal-container ${isMobile ? 'mobile' : 'desktop'}`}>
                {/* Header */}
                <div className="order-summary-modal-header">
                    <div className="header-content">
                        <h2>Order Summary</h2>
                        <p className="order-id">Order #{safeOrderData.orderId}</p>
                    </div>
                    <button 
                        className="close-button" 
                        onClick={onClose}
                        title="Close"
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="order-summary-modal-content">
                    {/* Delivery Address */}
                    <div className="delivery-address-section">
                        <h3>Delivery Address</h3>
                        <div className="address-card">
                            <div className="address-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div className="address-details">
                                <p className="address-main">{safeOrderData.deliveryAddress.address}</p>
                                {safeOrderData.deliveryAddress.locality && (
                                    <p className="address-line">{safeOrderData.deliveryAddress.locality}</p>
                                )}
                                <p className="address-location">
                                    {safeOrderData.deliveryAddress.city}, {safeOrderData.deliveryAddress.state} - {safeOrderData.deliveryAddress.pincode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items-section">
                        <h3>Order Items ({safeOrderData.items.length})</h3>
                        <div className="order-items-list">
                            {safeOrderData.items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="item-image">
                                        <div className="image-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="item-details">
                                        <h4 className="item-name">{item.name}</h4>
                                        <p className="item-quantity">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        <span className="price">₹{item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="cost-breakdown-section">
                        <h3>Cost Breakdown</h3>
                        <div className="cost-breakdown">
                            <div className="cost-row">
                                <span>Subtotal</span>
                                <span>₹{safeOrderData.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="cost-row">
                                <span>Platform Fee</span>
                                <span>₹{safeOrderData.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="cost-row discount">
                                <span>Discount</span>
                                <span>-₹{safeOrderData.discount.toFixed(2)}</span>
                            </div>
                            <div className="cost-row">
                                <span>Delivery Charge</span>
                                <span>₹{safeOrderData.deliveryCharge.toFixed(2)}</span>
                            </div>
                            <div className="cost-row total">
                                <span>Total</span>
                                <span>₹{safeOrderData.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="order-summary-modal-footer">
                    <div className="total-amount">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-value">₹{safeOrderData.total.toFixed(2)}</span>
                    </div>
                    <button 
                        className="pay-now-button"
                        onClick={handlePayNow}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </>
    );
};

export default OrderSummaryModal; 