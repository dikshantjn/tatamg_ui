import React from 'react';
import { useLocation } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
    const location = useLocation();
    const doctor = location.state?.doctor || {
        name: "Dr. John Doe",
        image: "https://via.placeholder.com/150", // Placeholder image URL
        specialty: "Cardiologist",
        fee: 250,
    };

    return (
        <div className="checkout-container">
            <h2>Booking Confirmation</h2>
            <div className="checkout-content">
                <div className="checkout-items">
                    <div className="doctor-card">
                        <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                        <div className="doctor-info">
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialty}</p>
                            <p>Consultation Fee: ${doctor.fee}</p>
                        </div>
                    </div>
                </div>
                <div className="order-summary">
                    <h3>Order summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Consultation Fee</span>
                            <span>${doctor.fee}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax estimate</span>
                            <span>$8</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${parseFloat(doctor.fee) + 8}</span>
                        </div>
                    </div>
                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
