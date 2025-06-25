import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './secondary/Header';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import DoctorProfile from './components/DoctorProfile'; 
import SignIn from './components/SignIn';
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
import MedicalInsurance from './components/MedicalInsurance';
import Vaccines from './components/Vaccines';
import MaternalCare from './components/MaternalCare';
import ChildCare from './components/ChildCare';
import MedicineDelivery from './components/MedicineDelivery';
import Physiotherapy from './components/Physiotherapy';
import HospitalDiscovery from './components/HospitalDiscovery.js';
import HospitalResults from './components/HospitalResults';
import CareAtHome from './components/CareAtHome.js';
import MedicalTourism from './components/MedicalTourism.js';
import Rehabilitation from './components/Rehabilitation.js';
import EarlyDetection from './components/EarlyDetection.js';
import Nutrition from './components/Nutrition.js';
import PetCare from './components/PetCare.js';
import OrganDonation from './components/OrganDonation.js';
import Ayurveda from './components/Ayurveda.js';
import CheckoutProducts from './components/checkoutproduct.js';
import CheckoutDelivery from './components/checkoutdelivery.js';
import CheckoutAmbulance from './components/checkoutambulance.js';
import PaymentGateway from './components/PaymentGateway.js';
import UserProfile from './components/UserProfile';
import { isAuthenticated as checkAuth } from './services/auth.utils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  // Handle auth state changes
  const handleAuthChange = (newState) => {
    console.log('Auth state changing to:', newState);
    setIsAuthenticated(newState);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Header 
          isAuthenticated={isAuthenticated} 
          onAuthChange={handleAuthChange}
        />
        <main className="main-content">
          <Routes>
            <Route 
              path="/signin" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <SignIn onAuthChange={handleAuthChange} />
              } 
            />
            {/* Protected routes */}
            {isAuthenticated ? (
              <>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/" element={<Home />} />
                <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
                <Route path="/product/:id" element={<ProductProfilePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/doctors" element={<ConsultDoctors />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/products" element={<Products />} />
                <Route path="/ambulance" element={<Ambulance />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/lab-tests" element={<LabTests />} />
                <Route path="/blood-bank" element={<BloodBank />} />
                <Route path="/find-donor" element={<FindDonor />} />
                <Route path="/register-donor" element={<RegisterDonor />} />
                <Route path="/medical-loans" element={<MedicalLoans />} />
                <Route path="/loan-form" element={<LoanForm />} />
                <Route path="/insurance" element={<MedicalInsurance />} />
                <Route path="/vaccines" element={<Vaccines />} />
                <Route path="/maternal-care" element={<MaternalCare />} />
                <Route path="/child-care" element={<ChildCare />} />
                <Route path="/delivery" element={<MedicineDelivery />} />
                <Route path="/physiotherapy" element={<Physiotherapy />} />
                <Route path="/hosiptal-discovery" element={<HospitalDiscovery />} />
                <Route path="/hospital-results" element={<HospitalResults />} />
                <Route path="/care-at-home" element={<CareAtHome />} />
                <Route path="/medical-tourism" element={<MedicalTourism />} />
                <Route path="/rehabilitation" element={<Rehabilitation />} />
                <Route path="/early-detection" element={<EarlyDetection />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/pet-care" element={<PetCare />} />
                <Route path="/organ-donation" element={<OrganDonation />} />
                <Route path="/ayurveda" element={<Ayurveda />} />
                <Route path="/checkout-2" element={<CheckoutProducts />} />
                <Route path="/checkout-3" element={<CheckoutDelivery />} />
                <Route path="/checkout-4" element={<CheckoutAmbulance />} />
                <Route path="/gateway" element={<PaymentGateway />} />
              </>
            ) : null}
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
