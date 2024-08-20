import React from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
    const doctors = [
        {
            id: 1,
            name: 'Dr. John Doe',
            specialty: 'Cardiologist',
            overview: 'Experienced in treating heart conditions and cardiovascular diseases.',
            image: 'doctor1.jpg',
        },
        {
            id: 2,
            name: 'Dr. Jane Smith',
            specialty: 'Dermatologist',
            overview: 'Specialist in skin diseases and cosmetic treatments.',
            image: 'doctor2.jpg',
        },
        // Add more doctors here
    ];

    return (
        <div className="search-results-page">
            <div className="results-container">
                <h2>Search Results</h2>
                <div className="doctor-cards">
                {doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                    <img src={doctor.image} alt={doctor.name} />
                    <h3>{doctor.name}</h3>
                    <p>{doctor.overview}</p>
                    <Link to={`/doctor-profile/${doctor.id}`}>Learn More</Link> {/* Link to profile */}
                </div>
                 ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;
