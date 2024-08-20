import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ConsultationServiceCard from './components/ConsultationServiceCard';
import SearchByHealthConcern from './components/SearchByHealthConcern';
import AppointmentSection from './components/AppointmentSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import DoctorProfile from './components/DoctorProfile'; 
import SignIn from './components/SignIn'; // Import SignIn component
import Checkout from './components/Checkout';


function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <ConsultationServiceCard />
                                <SearchByHealthConcern />
                                <AppointmentSection />
                                <Testimonials />
                            </>
                        } />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/doctor-profile/:id" element={<DoctorProfile />} /> {/* New route */}
                        <Route path="/signin" element={<SignIn />} /> {/* Add SignIn route */}
                        <Route path="/checkout" element={<Checkout />} /> {/* Add Checkout route */}
                        {/* Add more routes here if needed */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
