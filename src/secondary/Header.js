import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.jpg';
import cart from '../assets/cart.svg';


function Header() {
    return (
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
                    <button>Contact Us</button>
                    <button>
                        <img src={cart} alt="Cart" className="cart-icon" />
                        <span>Cart</span>
                    </button>
                    <button className="speak">Speak</button>
                    <button className="emergency">Emergency!</button>
                    
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
                    <Link to="/medical-insurance">MEDICAL INSURANCE</Link>
                    <Link to="/vaccines">VACCINES</Link>
                    <Link to="/maternal-care">MATERNAL CARE</Link>
                    <Link to="/child-care">CHILD CARE</Link>
                    <Link to="/delivery">MEDICINE DELIVERY</Link>
                </nav>
            </div>

            {/* Section 3: Sub Navigation (Third Bar) */}
            <div className="sub-nav">
                <div className="search-location-container">
                    <input type="text" placeholder="Select Location" className="location-search" />
                    <input type="text" placeholder="Search Healthcare Services and Products" className="category-search" />
                </div>

                <div className="sub-nav-links">
                    <a href="/">Physiotherapy</a>
                    <a href="/">Hospital Discovery</a>
                    <a href="/">Care At Home</a>
                    <a href="/">Medical Tourism</a>
                    <a href="/">Rehabilitation</a>
                    <a href="/">Early Detection</a>
                    <a href="/">Nutrition</a>
                    <a href="/">Pet Care</a>
                    <a href="/">Organ/Hair Donation</a>
                </div>
            </div>
        </header>
    );
}

export default Header;