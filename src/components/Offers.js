import React, { useState } from 'react';
import './Offers.css'; // Assuming you have a CSS file for styling

function Offers() {
    // State for managing selected offer type and modal visibility
    const [selectedOfferType, setSelectedOfferType] = useState('All');
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Example offer data with terms and conditions
    const offers = [
        {
            id: 1,
            type: 'Discount',
            image: 'path-to-image-1.jpg',
            title: '20% off on all health checkups',
            description: 'Get a 20% discount on all health checkups at our partnered clinics.',
            terms: 'This offer is valid until the end of the month and can be used only once.',
        },
        {
            id: 2,
            type: 'Cashback',
            image: 'path-to-image-2.jpg',
            title: '5% Cashback on medicines',
            description: 'Get 5% cashback when you purchase medicines online.',
            terms: 'Cashback will be credited within 24 hours of purchase.',
        },
        {
            id: 3,
            type: 'Limited Time',
            image: 'path-to-image-3.jpg',
            title: 'Limited time offer on lab tests',
            description: 'Avail discounts on lab tests for a limited period.',
            terms: 'Offer valid only for new customers and applicable on selected tests.',
        },
    ];

    // Offer types for the left panel
    const offerTypes = ['All', 'Discount', 'Cashback', 'Limited Time'];

    // Filtered offers based on selected type
    const filteredOffers = selectedOfferType === 'All'
        ? offers
        : offers.filter(offer => offer.type === selectedOfferType);

    // Handle opening and closing of the modal
    const openModal = (offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="offers-page">
            {/* Left Panel */}
            <div className="offers-left-panel">
                <h3>Select Offer Type</h3>
                <ul>
                    {offerTypes.map((type) => (
                        <li
                            key={type}
                            className={selectedOfferType === type ? 'active' : ''}
                            onClick={() => setSelectedOfferType(type)}
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Panel */}
            <div className="offers-right-panel">
                {filteredOffers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                        <img src={offer.image} alt={offer.title} className="offer-image" />
                        <div className="offer-details">
                            <h4>{offer.title}</h4>
                            <p>{offer.description}</p>
                            <button className="offer-details-btn" onClick={() => openModal(offer)}>See Offer Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for offer details */}
            {isModalOpen && selectedOffer && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedOffer.title}</h3>
                        <p>{selectedOffer.description}</p>
                        <h4>Terms & Conditions</h4>
                        <p>{selectedOffer.terms}</p>
                        <button className="add-offer-btn">Add Offer</button>
                        <button className="close-modal-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Offers;
