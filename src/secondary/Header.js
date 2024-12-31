import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.jpg';
import cart from '../assets/cart.svg';

function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header className="header">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                </div>

                {/* Hamburger Menu */}
                <button className="hamburger" onClick={toggleNav}>
                    ☰
                </button>
            </div>

            {/* Main Navigation with Burger Menu */}
            <nav className={`main-nav ${isNavOpen ? 'open' : ''}`}>
                <div className="nav-links">
                    <Link to="/products">Products</Link>
                    <Link to="/lab-tests">Lab Tests</Link>
                    <Link to="/doctors">Consult Doctors</Link>
                    <Link to="/blood-bank">Blood Bank</Link>
                    <Link to="/ambulance">Ambulance</Link>
                    <Link to="/medical-loans">Medical Loans</Link>
                    <Link to="/insurance">Medical Insurance</Link>
                    <Link to="/vaccines">Vaccines</Link>
                </div>

                {/* Buttons moved to hamburger menu */}
                <div className="menu-buttons">
                    <Link to="/offers">
                        <button>Offers</button>
                    </Link>
                    <Link to="/membership">
                        <button>Membership</button>
                    </Link>
                    <Link to="/signin">
                        <button>Sign up / Log In</button>
                    </Link>
                    <button
                        className="emergency"
                        onClick={() => {
                            const confirmCall = window.confirm("Do you want to call emergency services?");
                            if (confirmCall) {
                                window.location.href = "tel:+919921003190";
                            }
                        }}
                    >
                        Emergency!
                    </button>
                    <button className="cart-button">
                        <img src={cart} alt="Cart" className="cart-icon" />
                        <span>Cart</span>
                    </button>
                </div>
            </nav>

            {/* Sub Navigation */}
            <div className="sub-nav">
                <div className="search-location-container">
                    <input type="text" placeholder="Select Location" className="location-search" />
                    <input type="text" placeholder="Search Healthcare Services and Products" className="category-search" />
                </div>

                <div className="sub-nav-links">
                    <Link to="/nutrition">Nutrition</Link>
                    <Link to="/rehabilitation">Rehabilitation</Link>
                    <Link to="/early-detection">Early Detection</Link>
                    <Link to="/pet-care">Pet Care</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
