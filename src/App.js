import React from 'react';
import Header from './components/Header';
import ServiceCard from './components/ServiceCard';
import SearchByHealthConcern from './components/SearchByHealthConcern';
import AppointmentSection from './components/AppointmentSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <section className="services">
                    <ServiceCard title="Instant Video Consultation" description="Lorem ipsum dolor sit amet..." />
                    <ServiceCard title="Find Doctors near you" description="Lorem ipsum dolor sit amet..." />
                    <ServiceCard title="Surgeries" description="Lorem ipsum dolor sit amet..." />
                </section>
                <SearchByHealthConcern />
                <AppointmentSection />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
}

export default App;
