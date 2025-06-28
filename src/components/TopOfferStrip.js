import React, { useState, useEffect } from 'react';
import { colors } from '../styles/colors';

const TopOfferStrip = () => {
    const [currentOffer, setCurrentOffer] = useState(0);

    const offers = [
        {
            title: "New User Special",
            description: "Get 20% off on your first order",
            code: "NEWUSER20",
            bgGradient: "linear-gradient(135deg, #38A3A5 0%, #4FB5B7 100%)"
        },
        {
            title: "Free Health Checkup",
            description: "Book any test above ₹999",
            code: "HEALTH999",
            bgGradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"
        },
        {
            title: "Flash Sale",
            description: "Up to 40% off on health devices",
            code: "FLASH40",
            bgGradient: "linear-gradient(135deg, #4ECDC4 0%, #6EE7E7 100%)"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentOffer((prev) => (prev + 1) % offers.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="top-offer-strip">
            <div className="offer-strip-container">
                {offers.map((offer, index) => (
                    <div
                        key={index}
                        className={`strip-slide ${index === currentOffer ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${(index - currentOffer) * 100}%)`,
                            background: offer.bgGradient
                        }}
                    >
                        <div className="strip-content">
                            <div className="strip-text">
                                <h3>{offer.title}</h3>
                                <p>{offer.description}</p>
                            </div>
                            <div className="strip-code">
                                <span>Use Code:</span>
                                <code>{offer.code}</code>
                            </div>
                        </div>
                        <div className="strip-shapes">
                            <div className="shape circle"></div>
                            <div className="shape square"></div>
                            <div className="shape triangle"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="strip-indicators">
                {offers.map((_, index) => (
                    <button
                        key={index}
                        className={`strip-indicator ${index === currentOffer ? 'active' : ''}`}
                        onClick={() => setCurrentOffer(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopOfferStrip; 