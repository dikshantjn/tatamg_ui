import React, { useState } from "react";
import {Link } from "react-router-dom";
import "./MobileLayout.css";
import logo from "./assets/logo.jpg";
import cartIcon from "./assets/cart.svg";
import menuIcon from "./assets/menu.svg";
import emergencyIcon from "./assets/emergency.svg";
import closeIcon from "./assets/close.svg";
import sale from "./assets/sale.jpg"


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination } from 'swiper/modules';


function MobileLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="mobile-container">
            
            {/* Top Navigation Bar */}
            <header className="mobile-header">
                <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
                    <img src={menuIcon} alt="Menu" />
                </button>

                {/* Centered Logo */}
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="mobile-logo" />
                </div>

                {/* Cart & Emergency */}
                <div className="top-right-icons">
                    <Link to="/checkout">
                        <img src={cartIcon} alt="Cart" className="cart-icon" />
                    </Link>
                    <Link to="/emergency">
                        <img src={emergencyIcon} alt="Emergency" className="emergency-icon" />
                    </Link>
                </div>
            </header>



            {/* Location and Search Bar */}
            <div className="location-search-container">
                <input type="text" placeholder="Select Location" className="location-input" />
                <input type="text" placeholder="Search Healthcare Services & Products" className="search-input" />
            </div>

            {/* Horizontally Scrollable Navigation */}
            <div className="horizontal-scroll-nav">
                <Link to="/products">Products</Link>
                <Link to="/lab-tests">Lab Tests</Link>
                <Link to="/doctors">Consult Doctors</Link>
                <Link to="/blood-bank">Blood Bank</Link>
                <Link to="/ambulance">Ambulance</Link>
                <Link to="/medical-loans">Medical Loans</Link>
                <Link to="/insurance">Medical Insurance</Link>
                <Link to="/vaccines">Vaccines</Link>
            </div>

            {/* Ad Banner */}
            <div className="ad-banner">
                <img src={sale} alt="Ad Banner" />
            </div>

            {/* Search by Health Concern */}
            <section className="health-concern-section">
                <div className="heading-with-link">
                    <h2>Search by Health Concern</h2>
                    <Link to="/search" className="view-all-link">View All</Link>
                </div>
                <div className="health-concern-cards">
                    <div className="health-card">Card 1</div>
                    <div className="health-card">Card 2</div>
                    <div className="health-card">Card 3</div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2>What Our Clients Say</h2>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    pagination={{ clickable: true }}
                >
                    <SwiperSlide>
                        <div className="testimonial-card">
                            <p>"Amazing service and support!"</p>
                            <h4>- John Doe</h4>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="testimonial-card">
                            <p>"Very helpful and reliable."</p>
                            <h4>- Jane Smith</h4>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="testimonial-card">
                            <p>"Highly recommend this platform!"</p>
                            <h4>- Emily Johnson</h4>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </section>

            {/* Side Modal (Menu) */}
            {isMenuOpen && (
                <div className="side-modal">
                    <button className="close-modal" onClick={() => setIsMenuOpen(false)}>
                        <img src={closeIcon} alt="Close" />
                    </button>
                    <nav className="side-menu">
                        <Link to="/physiotherapy">Physiotherapy</Link>
                        <Link to="/hospital-discovery">Hospital Discovery</Link>
                        <Link to="/care-at-home">Care At Home</Link>
                        <Link to="/medical-tourism">Medical Tourism</Link>
                        <Link to="/nutrition">Nutrition</Link>
                        <Link to="/pet-care">Pet Care</Link>
                    </nav>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="mobile-bottom-nav">
                <Link to="/">Home</Link>
                <Link to="/emergency">Emergency</Link>
                <Link to="/speak">Speak</Link>
                <Link to="/membership">Membership</Link>
                <Link to="/offers">Offers</Link>
            </nav>
        </div>
    );
}

export default MobileLayout;
