import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { colors } from '../../../styles/colors';
import { DeliveryAddressService } from '../../../services/User/DeliveryAddress/delivery-address.service';
import { fetchCartItems } from '../../../store/slices/cartSlice';
import Lottie from 'lottie-react';
import findingDeliveryPartnerAnimation from '../../../assets/animations/findingDeliveryPartner.json';
import './CheckoutProductModal.css';
import medicineOrderPaymentService from '../../../services/payment/medicine-order-payment.service';
import _ from 'lodash';

const CheckoutMedicineModal = ({ isOpen, onClose, onPayNow, onPaymentSuccess, orderData }) => {
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(false);
    const [currentStep, setCurrentStep] = useState('address');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(true);
    const [animationError, setAnimationError] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [formData, setFormData] = useState({
        houseStreet: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        addressType: 'Home'
    });

    // Mock medicine order data for fallback
    const mockOrderData = {
        orderId: 'ORD-2024-001',
        items: [
            {
                id: 1,
                name: 'Paracetamol 500mg',
                quantity: 2,
                price: 15.00
            },
            {
                id: 2,
                name: 'Vitamin C 1000mg',
                quantity: 1,
                price: 25.00
            }
        ],
        deliveryAddress: {
            address: '123 Main Street',
            locality: 'Downtown',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        subtotal: 55.00,
        platformFee: 5.00,
        discount: 0.00,
        deliveryCharge: 10.00,
        total: 70.00
    };

    const orderDataToUse = orderData || mockOrderData;
    const safeOrderData = {
        orderId: orderDataToUse?.orderId || 'ORD-2024-001',
        items: orderDataToUse?.items || [],
        deliveryAddress: orderDataToUse?.deliveryAddress || mockOrderData.deliveryAddress,
        subtotal: orderDataToUse?.subtotal || 55.00,
        platformFee: orderDataToUse?.platformFee || 5.00,
        discount: orderDataToUse?.discount || 0.00,
        deliveryCharge: orderDataToUse?.deliveryCharge || 10.00,
        total: orderDataToUse?.total || 70.00
    };

    // Group items by orderId
    const itemsGroupedByOrder = _.groupBy(orderDataToUse.items, 'orderId');
    const orderGroups = Object.entries(itemsGroupedByOrder).map(([orderId, items]) => {
        // Calculate cost breakdown for each order
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // For simplicity, split discount, deliveryCharge, platformFee proportionally by subtotal
        const totalSubtotal = orderDataToUse.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = (orderDataToUse.discount || 0) * (subtotal / totalSubtotal);
        const deliveryCharge = (orderDataToUse.deliveryCharge || 0) * (subtotal / totalSubtotal);
        const platformFee = (orderDataToUse.platformFee || 0) * (subtotal / totalSubtotal);
        const total = subtotal + deliveryCharge + platformFee - discount;
        return {
            orderId,
            items,
            subtotal,
            discount,
            deliveryCharge,
            platformFee,
            total
        };
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchAddresses = async () => {
        try {
            setAddressesLoading(true);
            const addresses = await DeliveryAddressService.getAddresses();
            const transformedAddresses = addresses.map(addr => ({
                id: addr.addressId,
                type: addr.addressType,
                address: addr.houseStreet,
                locality: addr.addressLine1,
                city: addr.city,
                state: addr.state,
                pincode: addr.zipCode,
                isDefault: false
            }));
            setUserAddresses(transformedAddresses);
            if (transformedAddresses.length > 0) {
                setSelectedAddress(transformedAddresses[0]);
            }
        } catch (error) {
            showNotification('Failed to load addresses. Please try again.', 'error');
            setUserAddresses([]);
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (currentStep === 'address') {
                fetchAddresses();
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, currentStep]);

    useEffect(() => {
        if (currentStep === 'partner') {
            const timer = setTimeout(() => {
                setCurrentStep('summary');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleConfirmAddress = () => {
        if (selectedAddress) {
            setCurrentStep('partner');
        }
    };

    const handleAddNewAddress = () => {
        setShowAddForm(true);
    };

    const handleBackToList = () => {
        setShowAddForm(false);
        setFormData({
            houseStreet: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            addressType: 'Home'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveAddress = async () => {
        try {
            setLoading(true);
            await DeliveryAddressService.saveAddress(formData);
            setShowAddForm(false);
            setFormData({
                houseStreet: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                addressType: 'Home'
            });
            await fetchAddresses();
            showNotification('Address saved successfully');
        } catch (error) {
            showNotification('Failed to save address. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this address?');
        if (!isConfirmed) return;
        try {
            await DeliveryAddressService.deleteAddress(addressId);
            await fetchAddresses();
            showNotification('Address deleted successfully');
        } catch (error) {
            showNotification('Failed to delete address. Please try again.', 'error');
        }
    };

    const handlePayNow = async () => {
        console.log('Pay Now button clicked');
        console.log('orderDataToUse:', orderDataToUse);
        console.log('orderGroups:', orderGroups);
        try {
            setLoading(true);
            // Debugging: print all orderGroups and their data
            console.debug('Order Groups for Payment:', orderGroups);
            // For each order group, process payment and update order
            for (const group of orderGroups) {
                console.debug('Processing payment for orderId:', group.orderId, 'with data:', group);
                await medicineOrderPaymentService.processPayment(
                    {
                        ...orderDataToUse,
                        orderId: group.orderId,
                        items: group.items,
                        subtotal: group.subtotal,
                        discount: group.discount,
                        deliveryCharge: group.deliveryCharge,
                        platformFee: group.platformFee,
                        total: group.total,
                        addressId: selectedAddress?.id || selectedAddress?.addressId || null
                    },
                    (paymentResult) => {
                        setPaymentResult(paymentResult);
                        setPaymentStatus('success');
                        setCurrentStep('payment-success');
                        setLoading(false);
                        dispatch(fetchCartItems());
                        if (typeof window !== 'undefined') {
                            // Optionally clear local medicine cart state if needed
                            if (typeof window.clearMedicineCart === 'function') {
                                window.clearMedicineCart();
                            }
                        }
                        if (onPaymentSuccess) {
                            onPaymentSuccess();
                        }
                    },
                    (errorMessage) => {
                        setPaymentResult({ message: errorMessage });
                        setPaymentStatus('failed');
                        setCurrentStep('payment-failed');
                        setLoading(false);
                    }
                );
            }
        } catch (error) {
            setPaymentResult({ message: error.message || 'Payment failed. Please try again.' });
            setPaymentStatus('failed');
            setCurrentStep('payment-failed');
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (currentStep === 'payment-success' && onPaymentSuccess) {
            onPaymentSuccess();
        }
        setCurrentStep('address');
        setSelectedAddress(null);
        setShowAddForm(false);
        setPaymentResult(null);
        setPaymentStatus(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="checkout-modal-backdrop" onClick={handleClose}></div>
            {notification && (
                <div className={`checkout-notification ${notification.type}`}>{notification.message}</div>
            )}
            <div className={`checkout-modal-container ${isMobile ? 'mobile' : 'desktop'}`}>
                <div className="checkout-modal-header">
                    <div className="header-content">
                        <h2>
                            {currentStep === 'address' && (showAddForm ? 'Add New Address' : 'Confirm Delivery Address')}
                            {currentStep === 'partner' && 'Finding Delivery Partner'}
                            {currentStep === 'summary' && 'Order Summary'}
                            {currentStep === 'payment-success' && 'Payment Successful!'}
                            {currentStep === 'payment-failed' && 'Payment Failed'}
                        </h2>
                    </div>
                    <button className="close-button" onClick={handleClose} title="Close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="checkout-modal-content">
                    {currentStep === 'address' && (
                        <>
                            {!showAddForm ? (
                                <>
                                    <button className="add-address-button" onClick={handleAddNewAddress}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add New Address
                                    </button>
                                    <div className="address-list">
                                        {addressesLoading ? (
                                            <div className="address-loading">
                                                <div className="loading-spinner"></div>
                                                <p>Loading addresses...</p>
                                            </div>
                                        ) : userAddresses.length === 0 ? (
                                            <div className="no-addresses">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                <h3>No addresses found</h3>
                                                <p>You haven't added any delivery addresses yet.</p>
                                            </div>
                                        ) : (
                                            userAddresses.map((address) => (
                                                <div 
                                                    key={address.id} 
                                                    className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedAddress(address)}
                                                >
                                                    <div className="address-header">
                                                        <div className="address-type">
                                                            <span className="type-badge">{address.type}</span>
                                                            {address.isDefault && (
                                                                <span className="default-badge">Default</span>
                                                            )}
                                                        </div>
                                                        <div className="address-actions">
                                                            <button 
                                                                className="action-button delete-button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAddress(address.id);
                                                                }}
                                                                title="Delete Address"
                                                            >
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M3 6h18" />
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="address-details">
                                                        <div className="address-text">
                                                            <p className="address-main">{address.address}</p>
                                                            {address.locality && <p className="address-line">{address.locality}</p>}
                                                            <p className="address-location">{address.city}, {address.state} - {address.pincode}</p>
                                                        </div>
                                                    </div>
                                                    <div className="selection-indicator">
                                                        <div className="checkmark-button">
                                                            {selectedAddress?.id === address.id && (
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <path d="M20 6L9 17l-5-5" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="address-form">
                                    {/* ... address form fields ... */}
                                    {/* (Same as in CheckoutProductModal) */}
                                </div>
                            )}
                        </>
                    )}
                    {currentStep === 'partner' && (
                        <div className="delivery-partner-content">
                            <div className="animation-container">
                                {!animationError ? (
                                    <Lottie 
                                        animationData={findingDeliveryPartnerAnimation}
                                        loop={true}
                                        autoplay={true}
                                        style={{ width: '200px', height: '200px' }}
                                        onError={(error) => setAnimationError(true)}
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
                    )}
                    {currentStep === 'summary' && (
                        <>
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
                                        <p className="address-main">{selectedAddress?.address || 'No address selected'}</p>
                                        {selectedAddress?.locality && (
                                            <p className="address-line">{selectedAddress.locality}</p>
                                        )}
                                        <p className="address-location">
                                            {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                        </>
                    )}
                    {currentStep === 'payment-success' && paymentResult && (
                        <>
                            <div className="success-animation">
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                </svg>
                            </div>
                            <div className="success-content">
                                <h2>Payment Successful!</h2>
                                <p className="success-message">Your order has been placed successfully.</p>
                                <div className="order-details">
                                    <div className="detail-row">
                                        <span>Order ID:</span>
                                        <span className="order-id">{paymentResult.orderId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Payment ID:</span>
                                        <span className="payment-id">{paymentResult.paymentId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Amount Paid:</span>
                                        <span className="amount">₹{paymentResult.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="success-actions">
                                    <button 
                                        className="track-order-button"
                                        onClick={() => {
                                            handleClose();
                                        }}
                                    >
                                        Track Order
                                    </button>
                                    <button 
                                        className="close-success-button"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {currentStep === 'payment-failed' && paymentResult && (
                        <>
                            <div className="failed-animation">
                                <div className="cross"></div>
                            </div>
                            <div className="failed-content">
                                <h2>Payment Failed</h2>
                                <p className="failed-message">{paymentResult.message}</p>
                                <div className="failed-actions">
                                    <button 
                                        className="retry-payment-button"
                                        onClick={() => {
                                            setCurrentStep('summary');
                                            setPaymentResult(null);
                                            setPaymentStatus(null);
                                        }}
                                    >
                                        Try Again
                                    </button>
                                    <button 
                                        className="close-failed-button"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="checkout-modal-footer">
                    {currentStep === 'address' && (
                        <>
                            {!showAddForm ? (
                                <>
                                    <button className="cancel-button" onClick={handleClose}>
                                        Cancel
                                    </button>
                                    <button 
                                        className="confirm-button"
                                        onClick={handleConfirmAddress}
                                        disabled={!selectedAddress}
                                    >
                                        Confirm & Continue
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="cancel-button" onClick={handleBackToList}>
                                        Back
                                    </button>
                                    <button 
                                        className="confirm-button"
                                        onClick={handleSaveAddress}
                                        disabled={loading || !formData.houseStreet || !formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode}
                                    >
                                        {loading ? 'Saving...' : 'Save Address'}
                                    </button>
                                </>
                            )}
                        </>
                    )}
                    {currentStep === 'summary' && (
                        <>
                            <div className="total-amount">
                                <span className="total-label">Total Amount:</span>
                                <span className="total-value">₹{safeOrderData.total.toFixed(2)}</span>
                            </div>
                            <button 
                                className="pay-now-button"
                                onClick={() => { console.log('Pay Now button onClick fired'); handlePayNow(); }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Pay Now'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CheckoutMedicineModal; 