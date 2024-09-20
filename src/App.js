import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './secondary/Header';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import DoctorProfile from './components/DoctorProfile'; 
import SignIn from './components/SignIn'; // Import SignIn component
import Checkout from './components/Checkout';
import Products from './components/Products';
import ProductProfilePage from './components/ProductsProfile';
import Ambulance from './components/Ambulance';
import Offers from './components/Offers';
import Membership from './components/Membership';
import Home from './components/Home';
import ConsultDoctors from './components/ConsultDoctors';
import LabTests from './components/LabTests';
import BloodBank from './components/BloodBank';
import FindDonor from './components/FindDonor';
import RegisterDonor from './components/RegisterDonor';
import MedicalLoans from './components/MedicalLoans';
import LoanForm from './components/LoanForm';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        {/* <Route path="/" element={
                            <>
                                <ConsultationServiceCard />
                                <SearchByHealthConcern />
                                <AppointmentSection />
                                <Testimonials />
                            </>
                        } /> */}
                        <Route path="/" element={<Home />} /> {/* Home Page */}
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/doctors" element={<ConsultDoctors />} />
                        <Route path="/doctor-profile/:id" element={<DoctorProfile />} /> {/* New route */}
                        <Route path="/signin" element={<SignIn />} /> {/* Add SignIn route */}
                        <Route path="/checkout" element={<Checkout />} /> {/* Add Checkout route */}
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:id" element={<ProductProfilePage />} />
                        <Route path="/ambulance" element={<Ambulance />} />
                        <Route path="/offers" element={<Offers />} />
                        <Route path="/membership" element={<Membership />} />
                        <Route path="/lab-tests" element={<LabTests />} /> {/* LabTests Page */}
                        <Route path="/blood-bank" element={<BloodBank />} />
                        <Route path="/find-donor" element={<FindDonor />} />
                        <Route path="/register-donor" element={<RegisterDonor />} />
                        <Route path="/medical-loans" element={<MedicalLoans />} />
                        <Route path="/loan-form" element={<LoanForm />} />
                        {/* Add more routes here if needed */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
