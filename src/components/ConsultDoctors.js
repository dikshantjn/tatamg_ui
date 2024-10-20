import React from 'react';
import './ConsultDoctors.css';
import ConsultationServiceCard from './ConsultationServiceCard';
import SearchByHealthConcern from './SearchByHealthConcern';
import AppointmentSection from './AppointmentSection';
import Testimonials from './Testimonials';
import bannerImage from '../assets/Doctor Consultation.jpg'; // Replace with your actual image path

function ConsultDoctors() {
    return (
        <div className="consult-doctors-page">
            {/* Banner Section */}
            <section className="banner">
                <img src={bannerImage} alt="Consult Doctors Banner" className="banner-image" />
                <div className="banner-content">
                    <h1>Consult Top Doctors from the Comfort of Your Home</h1>
                    <p>Access expert medical advice and care anytime, anywhere.</p>
                </div>
            </section>

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
