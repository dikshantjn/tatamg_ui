import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            {/* Layer 1: Top Bar */}
            <div className="top-bar">
                <div className="location-search">
                    <input type="text" placeholder="Location" />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="buttons">
                    <button>Sign up</button>
                    <button>Log in</button>
                    <button className="emergency">Emergency!</button>
                    <button>Cart</button>
                    <button>Offers</button>
                    <button>Membership</button>
                </div>
            </div>

            {/* Layer 2: Main Navigation */}
            <div className="main-nav">
                <div className="logo"> {/* Add your logo here */}</div>
                <nav className="nav-links">
                    <a href="#">PRODUCTS</a>
                    <a href="#">LAB TESTS</a>
                    <a href="#">CONSULT DOCTORS</a>
                    <a href="#">BLOOD BANK</a>
                    <a href="#">AMBULANCE</a>
                    <a href="#">MEDICAL LOANS</a>
                    <a href="#">MEDICAL INSURANCE</a>
                    <a href="#">VACCINES</a>
                    <a href="#">MATERNAL CARE</a>
                    <a href="#">DELIVERY</a>
                    {/* Add more links as needed */}
                </nav>
            </div>

            {/* Layer 3: Sub Navigation */}
            <div className="sub-nav">
                <a href="#">Physiotherapy</a>
                <a href="#">Hospital Discovery</a>
                <a href="#">Care At Home</a>
                <a href="#">Medical Tourism</a>
                <a href="#">Rehabilitation</a>
                <a href="#">Early Detection</a>
            </div>
        </header>
    );
}

export default Header;
