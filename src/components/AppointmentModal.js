// AppointmentModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentModal.css';

function AppointmentModal({ show, onClose, doctor }) {
    const navigate = useNavigate();

    const handleBookNow = () => {
        onClose();
        navigate('/checkout', { state: { doctor } });
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <h2>Book Appointment</h2>
                <div className="appointment-options">
                    <button>Video Consultation</button>
                    <button>In Person</button>
                    <button>Chat</button>
                </div>
                <div className="appointment-details">
                    <input type="date" placeholder="Select Date" />
                    <select>
                        <option>Select Location</option>
                        <option>Location 1</option>
                        <option>Location 2</option>
                    </select>
                    <div className="time-slots">
                        <button>9:00 am</button>
                        <button>9:30 am</button>
                        <button>11:00 am</button>
                        <button>11:30 am</button>
                    </div>
                </div>
                <div className="patient-details">
                    <h3>Patient Details</h3>
                    <input type="text" placeholder="Name" />
                    <input type="text" placeholder="Phone" />
                    <input type="email" placeholder="Email" />
                    <textarea placeholder="Symptoms"></textarea>
                    <textarea placeholder="Past medical conditions (if any)"></textarea>
                    <button className="book-now" onClick={handleBookNow}>Book Now</button>
                </div>
            </div>
        </div>
    );
}

export default AppointmentModal;
