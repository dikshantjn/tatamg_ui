import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';
import male from '../assets/male doctor.jpg';
//import female from '../assets/female doctor.jpg';
//import drops from '../assets/drops.jpg';
//import wheelchair from '../assets/whelchair.jpg';
import blood from '../assets/blood test.jpg';

function SearchResults() {
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [feeFilter, setFeeFilter] = useState('');

    const doctors = [
        {
            id: 1,
            name: 'Dr. Dinesh Jain',
            specialty: 'Cardiologist',
            location: 'Pune',
            rating: 4.5,
            fees: 200,
            overview: 'Experienced in treating heart conditions and cardiovascular diseases.',
            image: male,
        },
    ];

    const products = [
        {
            id: 1,
            name: 'Blood tester',
            category: 'Wearable',
            price: '$99.99',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            image: blood,
        },
        // Add more products here
    ];

    // Filtered list based on selected filters (doctors)
    const filteredDoctors = doctors.filter(doctor => {
        return (
            (specialtyFilter === '' || doctor.specialty === specialtyFilter) &&
            (locationFilter === '' || doctor.location === locationFilter) &&
            (ratingFilter === '' || doctor.rating >= parseFloat(ratingFilter)) &&
            (feeFilter === '' || doctor.fees <= parseFloat(feeFilter))
        );
    });

    // No filtering logic for products for now, just show all products
    return (
        <div className="search-results-page">
            <div className="filter-options">
                <div className="filter-group">
                    <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)}>
                        <option value="">Specialty</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        {/* Add more specialties */}
                    </select>
                </div>
                <div className="filter-group">
                    <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                        <option value="">Location</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        {/* Add more locations */}
                    </select>
                </div>
                <div className="filter-group">
                    <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                        <option value="">Rating</option>
                        <option value="4.5">4.5 and above</option>
                        <option value="4.0">4.0 and above</option>
                        <option value="3.5">3.5 and above</option>
                        {/* Add more rating options */}
                    </select>
                </div>
                <div className="filter-group">
                    <select value={feeFilter} onChange={e => setFeeFilter(e.target.value)}>
                        <option value="">Fees</option>
                        <option value="200">Up to $200</option>
                        <option value="150">Up to $150</option>
                        <option value="100">Up to $100</option>
                        {/* Add more fee ranges */}
                    </select>
                </div>
                <div className="filter-group">
                    <select>
                        <option value="Relevance">Sort By: Relevance</option>
                        <option value="Rating">Sort By: Rating</option>
                        <option value="Fees">Sort By: Fees</option>
                    </select>
                </div>
            </div>

            <div className="results-container">
                <h2>Search Results for Doctors</h2>
                <div className="doctor-cards">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <div key={doctor.id} className="doctor-card">
                                <img src={doctor.image} alt={doctor.name} />
                                <div className="doctor-info">
                                    <h3>{doctor.name}</h3>
                                    <p>{doctor.overview}</p>
                                    <Link to={`/doctor-profile/${doctor.id}`}>Learn More</Link> {/* Link to profile */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No doctors found with the selected filters.</p>
                    )}
                </div>
            </div>

            <div className="results-container">
                <h2>Search Results for Products</h2>
                <div className="product-cards">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>{product.category}</p>
                                <p>{product.price}</p>
                                <p>{product.description}</p>
                                <Link to={`/product/${product.id}`} state={{ product }}>Learn More</Link> {/* Link to product */}
                                {/* Link to product */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;