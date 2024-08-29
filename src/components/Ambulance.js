import React, {useState} from 'react';
import './Ambulance.css';
import ambulance from '../assets/ambulance.jpg';

function Ambulance() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCallbackClick = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="ambulance-page">
            <div className="booking-section">
                <h2>BOOK AN AMBULANCE</h2>
                <p>Call us on <strong>1800-222-1111</strong></p>
                <p>OR</p>
                <form className="booking-form">
                    <input type="text" placeholder="Location / Address" />
                    <input type="text" placeholder="Full Name" />
                    <input type="text" placeholder="Contact Number" />
                    <select>
                        <option>Select Ambulance Type</option>
                        <option>Basic Ambulance</option>
                        <option>ICU Ambulance</option>
                        <option>Deadbody Ambulance</option>
                        <option>Pediatric Ambulance</option>
                        <option>Outstation Ambulance</option>
                        <option>Air Ambulance</option>
                        <option>Pet Ambulance</option>
                        <option>Wheelchair Ambulance</option>
                    </select>
                    <button type="submit" onClick={handleCallbackClick}>GET A CALL BACK</button>
                </form>
                {/* <div className="app-download">
                    <a href="/"><img src="google-play-badge.png" alt="Google Play" /></a>
                    <a href="/"><img src="app-store-badge.png" alt="App Store" /></a>
                </div> */}
            </div>
            <div className="awards-section">
                <img src={ambulance} alt="Awards and Recognition" />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>You should get a call from our service partners in the next 10 mins.</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ambulance;
