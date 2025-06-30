import React, { useState, useEffect } from 'react';
import { colors } from '../styles/colors';
import { DeliveryAddressService } from '../services/delivery-address.service';
import CheckoutProductModal from './CheckoutProductModal';
import './DeliveryAddressModal.css';

const DeliveryAddressModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(true);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
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

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Fetch addresses from API
    const fetchAddresses = async () => {
        try {
            setAddressesLoading(true);
            const addresses = await DeliveryAddressService.getAddresses();
            
            // Transform API data to match our component structure
            const transformedAddresses = addresses.map(addr => ({
                id: addr.addressId,
                type: addr.addressType,
                name: 'User', // You can add name field to your backend if needed
                phone: '+91 98765 43210', // You can add phone field to your backend if needed
                address: addr.houseStreet,
                locality: addr.addressLine1,
                city: addr.city,
                state: addr.state,
                pincode: addr.zipCode,
                isDefault: false // You can add isDefault field to your backend if needed
            }));
            
            setUserAddresses(transformedAddresses);
            
            // Set default address if available
            if (transformedAddresses.length > 0) {
                setSelectedAddress(transformedAddresses[0]);
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            showNotification('Failed to load addresses. Please try again.', 'error');
            setUserAddresses([]);
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
        }
    }, [isOpen]);

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

    const handleConfirm = () => {
        console.log('handleConfirm called, selectedAddress:', selectedAddress);
        if (selectedAddress) {
            console.log('Setting showCheckoutModal to true');
            setShowCheckoutModal(true);
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
            
            // Reset form and go back to list
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
            
            // Refresh address list
            await fetchAddresses();
            
            showNotification('Address saved successfully');
        } catch (error) {
            console.error('Failed to save address:', error);
            showNotification('Failed to save address. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await DeliveryAddressService.deleteAddress(addressId);
            
            // Refresh address list
            await fetchAddresses();
            
            showNotification('Address deleted successfully');
        } catch (error) {
            console.error('Failed to delete address:', error);
            showNotification('Failed to delete address. Please try again.', 'error');
        }
    };

    const handleChangeAddress = () => {
        // TODO: Implement change address functionality
        console.log('Change address clicked');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="address-modal-backdrop" onClick={onClose}></div>
            
            {/* Notification */}
            {notification && (
                <div className={`address-notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            
            {/* Modal Container */}
            <div className={`address-modal-container ${isMobile ? 'mobile' : 'desktop'}`}>
                {/* Header */}
                <div className="address-modal-header">
                    <div className="header-content">
                        <h2>{showAddForm ? 'Add New Address' : 'Confirm Delivery Address'}</h2>
                    </div>
                    <button 
                        className="close-button" 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (showAddForm) {
                                handleBackToList();
                            } else {
                                onClose();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        title="Close"
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="address-modal-content">
                    {!showAddForm ? (
                        <>
                            {/* Add New Address Button */}
                            <button className="add-address-button" onClick={handleAddNewAddress}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Add New Address
                            </button>

                            {/* Address List */}
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

                                            {/* Selection Indicator */}
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
                        /* Address Form */
                        <div className="address-form">
                            <div className="form-group">
                                <label htmlFor="addressType">Address Type *</label>
                                <select 
                                    id="addressType"
                                    name="addressType"
                                    value={formData.addressType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="houseStreet">House/Street *</label>
                                <input 
                                    type="text"
                                    id="houseStreet"
                                    name="houseStreet"
                                    value={formData.houseStreet}
                                    onChange={handleInputChange}
                                    placeholder="House number and street details"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="addressLine1">Address Line 1 *</label>
                                <input 
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    placeholder="Street address, apartment, suite, etc."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="addressLine2">Address Line 2</label>
                                <input 
                                    type="text"
                                    id="addressLine2"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    placeholder="Additional address information (optional)"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input 
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input 
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="zipCode">ZIP Code *</label>
                                    <input 
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="ZIP Code"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country *</label>
                                    <input 
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="Country"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="address-modal-footer">
                    {!showAddForm ? (
                        <>
                            <button className="cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button 
                                className="confirm-button"
                                onClick={handleConfirm}
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
                </div>
            </div>
            
            {/* Unified Checkout Modal */}
            <CheckoutProductModal 
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                orderData={{
                    orderId: 'ORD-' + Date.now(),
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
                    deliveryAddress: selectedAddress,
                    subtotal: 190.00,
                    platformFee: 10.00,
                    discount: 20.00,
                    deliveryCharge: 30.00,
                    total: 210.00
                }}
            />
        </>
    );
};

export default DeliveryAddressModal; 