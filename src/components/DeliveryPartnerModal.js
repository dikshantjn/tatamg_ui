import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import findingDeliveryPartnerAnimation from '../assets/animations/findingDeliveryPartner.json';
import OrderSummaryModal from './OrderSummaryModal';
import './DeliveryPartnerModal.css';

const DeliveryPartnerModal = ({ isOpen, onClose, orderData }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [animationError, setAnimationError] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);

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
            
            // Auto-show order summary after 5 seconds
            const timer = setTimeout(() => {
                setShowOrderSummary(true);
            }, 5000);
            
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'unset';
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleOrderSummaryClose = () => {
        setShowOrderSummary(false);
        onClose();
    };

    const handlePayNow = (orderData) => {
        console.log('Pay Now clicked with order data:', orderData);
        // TODO: Implement payment logic
        setShowOrderSummary(false);
        onClose();
    };

    if (!isOpen) return null;

    console.log('DeliveryPartnerModal rendering, isOpen:', isOpen);

    return (
        <>
            {/* Backdrop */}
            <div className="delivery-partner-modal-backdrop"></div>
            
            {/* Modal Container */}
            <div className={`delivery-partner-modal-container ${isMobile ? 'mobile' : 'desktop'}`}>
                {/* Content */}
                <div className="delivery-partner-content">
                    <div className="animation-container">
                        {!animationError ? (
                            <Lottie 
                                animationData={findingDeliveryPartnerAnimation}
                                loop={true}
                                autoplay={true}
                                style={{ width: '200px', height: '200px' }}
                                onError={(error) => {
                                    console.error('Lottie animation error:', error);
                                    setAnimationError(true);
                                }}
                            />
                        ) : (
                            <div className="fallback-spinner">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-content">
                        <h2>Finding Nearest Delivery Partner</h2>
                        <p>Please wait while we connect you with the best delivery partner in your area...</p>
                    </div>
                </div>
            </div>
            
            {/* Order Summary Modal */}
            <OrderSummaryModal 
                isOpen={showOrderSummary}
                onClose={handleOrderSummaryClose}
                onPayNow={handlePayNow}
                orderData={orderData}
            />
        </>
    );
};

export default DeliveryPartnerModal; 