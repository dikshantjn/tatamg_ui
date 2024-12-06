import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';
import './DoctorProfile.css';
import { useLocation } from 'react-router-dom';

function DoctorProfile() {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const doctor = location.state?.doctor;

    const handleBookNowClick = async () => {
        try {
            const response = await fetch('http://localhost:8000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: doctor.id, // Ensure `doctor.id` is passed correctly
                    name: doctor.name, // Doctor's name
                    price: doctor.fee, // Fee for the doctor
                    quantity: 1, // Default quantity for appointments
                }),
            });
    
            if (response.ok) {
                alert('Doctor appointment added to cart successfully!');
            } else {
                const errorData = await response.json();
                console.error('Response Error:', errorData);
                alert(`Failed to add appointment to cart: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding appointment to cart:', error);
            alert('Something went wrong. Please try again later.');
        }
    };
    
    
    return (
        <div className="doctor-profile">
            <div className="profile-header">
                <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                <div className="doctor-info">
                    <h2>{doctor.name}</h2>
                    <p>{doctor.specialty}</p>
                    <p><strong>Fee:</strong> ₹{doctor.fee}</p>
                    <p><strong>Location:</strong> {doctor.location}</p>
                    <p>{doctor.overview}</p>
                    <button onClick={handleBookNowClick}>Book Now</button>
                </div>
            </div>
            <div className="doctor-reviews">
                <h3>Reviews</h3>
                <div className="review">
                    <h4>John Doe</h4>
                    <p>Excellent doctor! Highly recommend.</p>
                </div>
                <div className="review">
                    <h4>Jane Smith</h4>
                    <p>Very professional and knowledgeable.</p>
                </div>
            </div>
            <AppointmentModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}

export default DoctorProfile;
