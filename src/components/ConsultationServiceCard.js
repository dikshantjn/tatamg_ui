import React from 'react';
import './ConsultationServiceCard.css';

function ConsultationServiceCard() {
    return (
        <div className="service-card-container">
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
