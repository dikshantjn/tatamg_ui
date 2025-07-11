import React from 'react';
import HeroBanner from './HeroBanner';
import SearchByHealthConcern from './SearchByHealthConcern';
import SearchByCategory from './SearchByCategory';
import SearchByBrand from './SearchByBrand';
import ServicesAndOffers from './ServicesAndOffers';
import Testimonials from './Testimonials';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <HeroBanner />
            <SearchByHealthConcern />
            <SearchByCategory />
            <SearchByBrand />
            <ServicesAndOffers />
            <Testimonials />
        </div>
    );
}

export default Home;
