import React from 'react';
import './Home.css';
import HeroBanner from './HeroBanner';
import SearchByCategory from './SearchByCategory';
import SearchByHealthConcern from './SearchByHealthConcern';
import SearchByBrand from './SearchByBrand';
import Testimonials from './Testimonials';

function Home() {
    return (
        <div className="home-page">
            <HeroBanner />
            

            <div className="search-section health-concern">
                <SearchByHealthConcern />
            </div>

            <div className="search-section category">
                <SearchByCategory />
            </div>
            
            <div className="search-section brand">
                <SearchByBrand />
            </div>

            <div className="testimonials-section">
                <Testimonials />
            </div>
        </div>
    );
}

export default Home;
