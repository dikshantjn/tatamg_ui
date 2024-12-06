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
                    <Link to="/checkout">
                        <button>
                            <img src={cart} alt="Cart" className="cart-icon" />
                            <span>Cart</span>
                        </button>
                    </Link>
                    <Link to="/checkout-2">
                        <button>
                            <span>Cart 2</span>
                        </button>
                    </Link>
                    <Link to="/checkout-3">
                        <button>
                            <span>Cart 3</span>
                        </button>
                    </Link>
                    <Link to="/checkout-4">
                        <button>
                            <span>Cart 4</span>
                        </button>
                    </Link>
                    <button className="speak">Speak</button>
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

            {/* Section 3: Sub Navigation (Third Bar) */}
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
    );
}

export default Header;