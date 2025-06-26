import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import HeroBanner from './HeroBanner';
import SearchByCategory from './SearchByCategory';
import SearchByHealthConcern from './SearchByHealthConcern';
import SearchByBrand from './SearchByBrand';
import Testimonials from './Testimonials';

function Home() {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate('/profile');
    };

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

            {/* ✅ New Navigate to Profile Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button onClick={goToProfile} style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#3B82F6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}>
                    Go to Profile
                </button>
            </div>

            <div className="testimonials-section">
                <Testimonials />
            </div>
        </div>
    );
}

export default Home;
