import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';
import './DoctorProfile.css';
import male from '../assets/male doctor.jpg';

function DoctorProfile() {
    const [showModal, setShowModal] = useState(false);

    const handleBookAppointmentClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="doctor-profile">
            <div className="profile-header">
                <img src={male} alt="Doctor" className="doctor-image" />
                <div className="doctor-info">
                    <h2>Dr. Dinesh Jain</h2>
                    <p>150 reviews</p>
                    <p>Lorem ipsum dolor sit amet...</p>
                    <p><strong>Clinic Address:</strong> Lorem ipsum dolor sit amet...</p>
                    <p><strong>Consultation Timings:</strong> Mon - Sat: 7 am - 7 pm</p>
                    <button onClick={handleBookAppointmentClick}>Book Appointment</button>
                    <button>Chat Now</button>
                </div>
            </div>
            <div className="doctor-reviews">
                <h3>Reviews</h3>
                <div className="review">
                    <h4>Luca</h4>
                    <p>This is the best white t-shirt out there...</p>
                </div>
                <div className="review">
                    <h4>Luca</h4>
                    <p>This is the best white t-shirt out there...</p>
                </div>
                <div className="review">
                    <h4>Luca</h4>
                    <p>This is the best white t-shirt out there...</p>
                </div>
            </div>
            <AppointmentModal show={showModal} onClose={handleCloseModal} />
        </div>
    );
}

export default DoctorProfile;