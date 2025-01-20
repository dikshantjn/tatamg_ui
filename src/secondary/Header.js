import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.jpg';
import cart from '../assets/cart.svg';

function Header() {
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        query: ''
    });

    // Handle Emergency Button Click
    const handleEmergencyClick = () => {
        setShowEmergencyModal(true);
    };

    const proceedToCall = () => {
        setShowEmergencyModal(false);
        const confirmCall = window.confirm("Do you want to call emergency services?");
        if (confirmCall) {
            window.location.href = "tel:+919921003190";
        }
    };

    // Handle Contact Us Modal
    const handleContactClick = () => {
        setShowContactModal(true);
    };

    const handleCloseContactModal = () => {
        setShowContactModal(false);
        setContactForm({ name: '', email: '', phone: '', query: '' }); // Reset form
    };

    const handleFormChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleSubmitContactForm = (e) => {
        e.preventDefault();
        alert("We have received your query, you will soon receive a call from our Expert.");
        handleCloseContactModal();
    };

    return (
        <>
            <header className="header">
                {/* Section 1: Top Bar */}
                <div className="top-bar">
                    <div className="logo-container">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="logo" />
                        </Link>
                    </div>

                    <div className="buttons">
                        <Link to="/offers">
                            <button>Offers</button>
                        </Link>
                        <Link to="/membership">
                            <button>Membership</button>
                        </Link>
                        <Link to="/signin">
                            <button>Sign up / Log In</button>
                        </Link>
                        <button onClick={handleContactClick}>Contact Us</button>
                        <Link to="/checkout">
                            <button>
                                <img src={cart} alt="Cart" className="cart-icon" />
                                <span>Cart</span>
                            </button>
                        </Link>
                        <button className="speak">Speak</button>
                        <button className="emergency" onClick={handleEmergencyClick}>
                            Emergency!
                        </button>
                    </div>
                </div>

                {/* Section 2: Main Navigation */}
                <div className="main-nav">
                    <nav className="nav-links">
                        <Link to="/products">PRODUCTS</Link>
                        <Link to="/lab-tests">LAB TESTS</Link>
                        <Link to="/doctors">CONSULT DOCTORS</Link>
                        <Link to="/blood-bank">BLOOD BANK</Link>
                        <Link to="/ambulance">AMBULANCE</Link>
                        <Link to="/medical-loans">MEDICAL LOANS</Link>
                        <Link to="/insurance">MEDICAL INSURANCE</Link>
                        <Link to="/vaccines">VACCINES</Link>
                        <Link to="/maternal-care">MATERNAL CARE</Link>
                        <Link to="/child-care">CHILD CARE</Link>
                        <Link to="/delivery">MEDICINE DELIVERY</Link>
                        <Link to="/ayurveda">AYURVEDA</Link>
                    </nav>
                </div>

                {/* Section 3: Sub Navigation */}
                <div className="sub-nav">
                    <div className="search-location-container">
                        <input type="text" placeholder="Select Location" className="location-search" />
                        <input type="text" placeholder="Search Healthcare Services and Products" className="category-search" />
                    </div>

                    <div className="sub-nav-links">
                        <Link to="/physiotherapy">Physiotherapy</Link>
                        <Link to="/hosiptal-discovery">Hospital Discovery</Link>
                        <Link to="/care-at-home">Care At Home</Link>
                        <Link to="/medical-tourism">Medical Tourism</Link>
                        <Link to="/rehabilitation">Rehabilitation</Link>
                        <Link to="/early-detection">Early Detection</Link>
                        <Link to="/nutrition">Nutrition</Link>
                        <Link to="/pet-care">Pet Care</Link>
                        <Link to="/organ-donation">Organ/Hair Donation</Link>
                    </div>
                </div>
            </header>

            {/* Emergency Modal */}
            {showEmergencyModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Emergency Service</h2>
                        <p><strong>English:</strong></p>
                        <p>Hello!<br />
                            Thank you for choosing the Emergency Service Option.<br />
                            To avail 24/7 Support, we request you to choose one of the Membership Plans.
                        </p>
                        <ul>
                            <li>24/7 Emergency Support</li>
                            <li>Lab Test Booking and Test Report Delivery</li>
                            <li>Expert Healthcare Professional Assistance</li>
                            <li>Option to add unlimited Healthcare Reports/Prescription/Medical Bills/Mediclaim Policy</li>
                        </ul>

                        <p><strong>Hindi:</strong></p>
                        <p>नमस्ते!<br />
                            आपातकालीन सेवा विकल्प चुनने के लिए धन्यवाद।<br />
                            24/7 सहायता प्राप्त करने के लिए, हम आपसे सदस्यता योजना में से एक चुनने का अनुरोध करते हैं।
                        </p>
                        <ul>
                            <li>24/7 आपातकालीन सहायता</li>
                            <li>लैब टेस्ट बुकिंग और टेस्ट रिपोर्ट डिलीवरी</li>
                            <li>विशेषज्ञ स्वास्थ्य देखभाल पेशेवर सहायता</li>
                            <li>असीमित हेल्थकेयर रिपोर्ट/प्रिस्क्रिप्शन/मेडिकल बिल/मेडिक्लेम पॉलिसी जोड़ने का विकल्प</li>
                        </ul>

                        <div className="modal-buttons">
                            <button onClick={proceedToCall}>Proceed to Call</button>
                            <button onClick={() => setShowEmergencyModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Us Modal */}
            {showContactModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Contact Us</h2>
                        <form onSubmit={handleSubmitContactForm}>
                            <label>Name:</label>
                            <input type="text" name="name" value={contactForm.name} onChange={handleFormChange} required />

                            <label>Email ID:</label>
                            <input type="email" name="email" value={contactForm.email} onChange={handleFormChange} required />

                            <label>Mobile Number:</label>
                            <input type="tel" name="phone" value={contactForm.phone} onChange={handleFormChange} required />

                            <label>What can we help you with?</label>
                            <textarea name="query" value={contactForm.query} onChange={handleFormChange} required />

                            <div className="modal-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={handleCloseContactModal}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
