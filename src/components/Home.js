import React from 'react';
import './Home.css';
import SearchByHealthConcern from './SearchByHealthConcern';
import SearchByBrand from './SearchByBrand';
import SearchByCategory from './SearchByCategory';
import Testimonials from './Testimonials';
import sale from '../assets/sale.jpg';

function Home() {
    return (
        <div className="home-page">
            {/* Banner Section */}
            <div className="banner">
                <img src={sale} alt="Special Offers" className="banner-image" />
            </div>

            <div className="banner">
                <img src={sale} alt="Special Offers" className="banner-image" />
            </div>

            {/* Search by Health Concern Section */}
            <div className="search-section health-concern">
                <SearchByHealthConcern />
            </div>

            <div className="search-section brand">
                <SearchByBrand />
            </div>

            {/* Appointment Section */}
            <div className="search-section category">
                <SearchByCategory />
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
                <Testimonials />
            </div>
        </div>
    );
}

export default Home;
