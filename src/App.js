import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import HospitalDiscovery from './components/HospitalDiscovery';
import HospitalResults from './components/HospitalResults';
import CareAtHome from './components/CareAtHome';
import MedicalTourism from './components/MedicalTourism';
import Rehabilitation from './components/Rehabilitation';
import EarlyDetection from './components/EarlyDetection';
import Nutrition from './components/Nutrition';
import PetCare from './components/PetCare';
import OrganDonation from './components/OrganDonation';
import Ayurveda from './components/Ayurveda';
import CheckoutProducts from './components/checkoutproduct';
import CheckoutDelivery from './components/checkoutdelivery';
import CheckoutAmbulance from './components/checkoutambulance';
import PaymentGateway from './components/PaymentGateway';
import UserProfile from './components/UserProfile';

import { isAuthenticated as checkAuth } from './services/auth.utils';

// Component to handle route-based SignIn display
const AppContent = ({ isAuthenticated, onAuthChange, onShowSignIn }) => {
  const location = useLocation();
  const [showSignInPanel, setShowSignInPanel] = useState(false);
  const [shouldShowSignInForProtectedRoute, setShouldShowSignInForProtectedRoute] = useState(false);

  // Check if current path is a protected route
  const isProtectedRoute = (path) => {
    const protectedPaths = [
      '/doctor-profile', '/search', '/doctors', '/checkout', '/ambulance', 
      '/offers', '/membership', '/lab-tests', '/blood-bank', '/find-donor', 
      '/register-donor', '/medical-loans', '/loan-form', '/insurance', 
      '/vaccines', '/maternal-care', '/child-care', '/delivery', '/physiotherapy', 
      '/hospital-discovery', '/hospital-results', '/care-at-home', '/medical-tourism', 
      '/rehabilitation', '/early-detection', '/nutrition', '/pet-care', 
      '/organ-donation', '/ayurveda', '/checkout-2', '/checkout-3', '/checkout-4', 
      '/gateway', '/profile', '/orders'
    ];
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
  };

  // Check if we should show SignIn panel for protected route access
  useEffect(() => {
    if (!isAuthenticated && isProtectedRoute(location.pathname)) {
      setShouldShowSignInForProtectedRoute(true);
    }
  }, [location.pathname, isAuthenticated]);

  const handleShowSignIn = () => {
    setShowSignInPanel(true);
  };

  const handleAuthChange = (authState) => {
    console.log("🔄 Auth state changed:", authState);
    onAuthChange(authState);
    // Close SignIn panel when user successfully logs in
    if (authState) {
      setShowSignInPanel(false);
      setShouldShowSignInForProtectedRoute(false);
    }
  };

  const handleCloseSignIn = () => {
    setShowSignInPanel(false);
    setShouldShowSignInForProtectedRoute(false);
  };

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} onAuthChange={onAuthChange} onShowSignIn={handleShowSignIn} />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />

          {/* Protected - redirect to home if not authenticated */}
          <Route path="/doctor-profile/:id" element={
            isAuthenticated ? <DoctorProfile /> : <Navigate to="/" replace />
          } />
          <Route path="/search" element={
            isAuthenticated ? <SearchResults /> : <Navigate to="/" replace />
          } />
          <Route path="/doctors" element={
            isAuthenticated ? <ConsultDoctors /> : <Navigate to="/" replace />
          } />
          <Route path="/checkout" element={
            isAuthenticated ? <Checkout /> : <Navigate to="/" replace />
          } />
          <Route path="/ambulance" element={
            isAuthenticated ? <Ambulance /> : <Navigate to="/" replace />
          } />
          <Route path="/offers" element={
            isAuthenticated ? <Offers /> : <Navigate to="/" replace />
          } />
          <Route path="/membership" element={
            isAuthenticated ? <Membership /> : <Navigate to="/" replace />
          } />
          <Route path="/lab-tests" element={
            isAuthenticated ? <LabTests /> : <Navigate to="/" replace />
          } />
          <Route path="/blood-bank" element={
            isAuthenticated ? <BloodBank /> : <Navigate to="/" replace />
          } />
          <Route path="/find-donor" element={
            isAuthenticated ? <FindDonor /> : <Navigate to="/" replace />
          } />
          <Route path="/register-donor" element={
            isAuthenticated ? <RegisterDonor /> : <Navigate to="/" replace />
          } />
          <Route path="/medical-loans" element={
            isAuthenticated ? <MedicalLoans /> : <Navigate to="/" replace />
          } />
          <Route path="/loan-form" element={
            isAuthenticated ? <LoanForm /> : <Navigate to="/" replace />
          } />
          <Route path="/insurance" element={
            isAuthenticated ? <MedicalInsurance /> : <Navigate to="/" replace />
          } />
          <Route path="/vaccines" element={
            isAuthenticated ? <Vaccines /> : <Navigate to="/" replace />
          } />
          <Route path="/maternal-care" element={
            isAuthenticated ? <MaternalCare /> : <Navigate to="/" replace />
          } />
          <Route path="/child-care" element={
            isAuthenticated ? <ChildCare /> : <Navigate to="/" replace />
          } />
          <Route path="/delivery" element={
            isAuthenticated ? <MedicineDelivery /> : <Navigate to="/" replace />
          } />
          <Route path="/physiotherapy" element={
            isAuthenticated ? <Physiotherapy /> : <Navigate to="/" replace />
          } />
          <Route path="/hospital-discovery" element={
            isAuthenticated ? <HospitalDiscovery /> : <Navigate to="/" replace />
          } />
          <Route path="/hospital-results" element={
            isAuthenticated ? <HospitalResults /> : <Navigate to="/" replace />
          } />
          <Route path="/care-at-home" element={
            isAuthenticated ? <CareAtHome /> : <Navigate to="/" replace />
          } />
          <Route path="/medical-tourism" element={
            isAuthenticated ? <MedicalTourism /> : <Navigate to="/" replace />
          } />
          <Route path="/rehabilitation" element={
            isAuthenticated ? <Rehabilitation /> : <Navigate to="/" replace />
          } />
          <Route path="/early-detection" element={
            isAuthenticated ? <EarlyDetection /> : <Navigate to="/" replace />
          } />
          <Route path="/nutrition" element={
            isAuthenticated ? <Nutrition /> : <Navigate to="/" replace />
          } />
          <Route path="/pet-care" element={
            isAuthenticated ? <PetCare /> : <Navigate to="/" replace />
          } />
          <Route path="/organ-donation" element={
            isAuthenticated ? <OrganDonation /> : <Navigate to="/" replace />
          } />
          <Route path="/ayurveda" element={
            isAuthenticated ? <Ayurveda /> : <Navigate to="/" replace />
          } />
          <Route path="/checkout-2" element={
            isAuthenticated ? <CheckoutProducts /> : <Navigate to="/" replace />
          } />
          <Route path="/checkout-3" element={
            isAuthenticated ? <CheckoutDelivery /> : <Navigate to="/" replace />
          } />
          <Route path="/checkout-4" element={
            isAuthenticated ? <CheckoutAmbulance /> : <Navigate to="/" replace />
          } />
          <Route path="/gateway" element={
            isAuthenticated ? <PaymentGateway /> : <Navigate to="/" replace />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <UserProfile /> : <Navigate to="/" replace />
          } />
          <Route path="/orders" element={
            isAuthenticated ? <UserProfile /> : <Navigate to="/" replace />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      
      {/* SignIn Panel - shown as overlay when needed */}
      <SignIn 
        isOpen={showSignInPanel || shouldShowSignInForProtectedRoute} 
        onClose={handleCloseSignIn}
        onAuthChange={handleAuthChange}
      />
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      console.log("🔐 Auth status check:", authStatus);
      setIsAuthenticated(authStatus);
      setIsCheckingAuth(false);
    };
    verifyAuth();
  }, []);

  const handleAuthChange = (authState) => {
    console.log("🔄 Auth state changed:", authState);
    setIsAuthenticated(authState);
  };

  if (isCheckingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} 
        onAuthChange={handleAuthChange}
      />
    </Router>
  );
}

export default App;
