import React from 'react';
import './ConsultDoctors.css';
import ConsultationServiceCard from './ConsultationServiceCard';
import SearchByHealthConcern from './SearchByHealthConcern';
import AppointmentSection from './AppointmentSection';
import Testimonials from './Testimonials';

function ConsultDoctors() {
    return (
        <div className="home-page">

            {/* Search by Health Concern Section */}
            <div className="search-section health-concern">
                <ConsultationServiceCard />
            </div>

            <div className="search-section brand">
                <SearchByHealthConcern />
            </div>

            {/* Appointment Section */}
            <div className="search-section category">
                <AppointmentSection />
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
                <Testimonials />
            </div>
        </div>
    );
}

export default ConsultDoctors;
