import React from 'react';
import './ServiceCard.css';

function ConsultationServiceCard() {
    return (
        <div className="service-card-container">
            <h3>Instant Video Consultation</h3>
            <div className="scrollable-options">
                <div className="option">
                    <div className="icon"></div>
                    <h4>Instant Video Consultation</h4>
                    <p>Consult with a general physician.</p>
                </div>
                <div className="option">
                    <div className="icon"></div>
                    <h4>Find Doctors Near You</h4>
                    <p>Speak with a specialist.</p>
                </div>
                <div className="option">
                    <div className="icon"></div>
                    <h4>Surgeries</h4>
                    <p>Get immediate advice for urgent issues.</p>
                </div>
            </div>
        </div>
    );
}

export default ConsultationServiceCard;
