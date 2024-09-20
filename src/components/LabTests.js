import React, { useState } from 'react';
import './LabTests.css';
import price from '../assets/price.png';
import report from '../assets/report.png';
import hygiene from '../assets/hygiene.png';
import pickup from '../assets/home_pickup.png';
import consultation from '../assets/consultation.png';
import Testimonials from './Testimonials';

function LabTests() {
    // Categories and Tests Data
    const categories = ['Blood Tests', 'COVID-19 Tests', 'Diabetes Tests', 'Allergy Tests'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const tests = {
        'Blood Tests': [
            { name: 'Complete Blood Count (CBC)', details: 'Comprehensive blood test.', price: 'Rs. 500' },
            { name: 'Liver Function Test (LFT)', details: 'Test to check liver health.', price: 'Rs. 600' },
        ],
        'COVID-19 Tests': [
            { name: 'RT-PCR Test', details: 'Test for COVID-19 virus.', price: 'Rs. 800' },
            { name: 'Antibody Test', details: 'Check for antibodies post COVID-19.', price: 'Rs. 700' },
        ],
        'Diabetes Tests': [
            { name: 'HbA1c Test', details: 'Test for diabetes monitoring.', price: 'Rs. 400' },
            { name: 'Glucose Tolerance Test', details: 'Test to diagnose diabetes.', price: 'Rs. 450' },
        ],
        'Allergy Tests': [
            { name: 'Food Allergy Test', details: 'Check for food allergies.', price: 'Rs. 1500' },
            { name: 'Pet Allergy Test', details: 'Test for common pet allergies.', price: 'Rs. 1400' },
        ],
    };

    const filteredTests = selectedCategory === 'All' 
        ? Object.values(tests).flat() 
        : tests[selectedCategory];

    return (
        <div className="lab-tests-page">
            {/* Why Trust "Get Tested at Home" Section */}
            <div className="trust-section">
                <h2>Lab Test From The Comfort Of Your Home</h2>
                <p>Trusted by 40 Lakhs+ satisfied customers | 1 Crore+ lab tests booked</p>
                <div className="trust-icons">
                    <div className="trust-icon">
                        <img src={hygiene} alt="100% Safe & Hygienic" />
                        <p>100% Safe & Hygienic</p>
                    </div>
                    <div className="trust-icon">
                        <img src={pickup} alt="Home Sample Pick Up" />
                        <p>Home Sample Pick Up</p>
                    </div>
                    <div className="trust-icon">
                        <img src={report} alt="View Reports Online" />
                        <p>View Reports Online</p>
                    </div>
                    <div className="trust-icon">
                        <img src={consultation} alt="Free Doctor Consultation" />
                        <p>Free Doctor Consultation</p>
                    </div>
                    <div className="trust-icon">
                        <img src={price} alt="Best Prices Guaranteed" />
                        <p>Best Prices Guaranteed</p>
                    </div>
                </div>
                <button className="view-packages-btn">View Popular Packages</button>
            </div>

            {/* Popular Health Checkups Section */}
            <div className="popular-tests-section">
                {/* Heading and View All button container */}
                <div className="section-header">
                    <h2>Popular Health Checkups</h2>
                    <button className="view-all-button" onClick={() => window.location.href='/search-results'}>
                        View All
                    </button>
                </div>

                <div className="category-buttons">
                    <button className={selectedCategory === 'All' ? 'active' : ''} onClick={() => setSelectedCategory('All')}>
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={selectedCategory === category ? 'active' : ''}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="tests-list">
                    {filteredTests.map((test, index) => (
                        <div key={index} className="test-card">
                            <h3>{test.name}</h3>
                            <p>{test.details}</p>
                            <p><strong>{test.price}</strong></p>
                            <div className="test-buttons">
                                <button className="view-btn">View</button>
                                <button className="add-to-cart-btn">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
                <Testimonials />
            </div>
        </div>
    );
}

export default LabTests;