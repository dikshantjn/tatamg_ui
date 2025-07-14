import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import healthcareTheme from './theme/healthcareTheme';

import Header from './components/User/header/Header';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import DoctorProfile from './components/DoctorProfile';
import SignIn from './components/SignIn';
import ProductVendorDashboard from './components/Vendors/ProductVendor/ProductVendorDashboard';
import ProductVendorProducts from './components/Vendors/ProductVendor/ProductVendorProducts';
import HospitalVendorDashboard from './components/Vendors/HospitalVendor/HospitalVendorDashboard';
import DoctorConsultationVendorDashboard from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorDashboard';
import MedicalStoreVendorDashboard from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorDashboard';
import AmbulanceVendorDashboard from './components/Vendors/AmbulanceVendor/AmbulanceVendorDashboard';
import BloodBankVendorDashboard from './components/Vendors/BloodBankVendor/BloodBankVendorDashboard';
import LabTestVendorDashboard from './components/Vendors/LabTestVendor/LabTestVendorDashboard';
import DeliveryPartnerVendorDashboard from './components/Vendors/DeliveryPartnerVendor/DeliveryPartnerVendorDashboard';
import DummySidePanel from './components/DummySidePanel';
import Checkout from './components/Checkout';
import Products from './components/User/Products/Products';
import ProductProfilePage from './components/ProductsProfile';
import Ambulance from './components/User/Ambulance/Ambulance';
import Offers from './components/Offers';
import Membership from './components/Membership';
import Home from './components/User/Home/Home';
import ConsultDoctors from './components/User/DoctorConsultation/ConsultDoctors';
import LabTests from './components/User/LabTest/LabTests';
import BloodBank from './components/User/BloodBank/BloodBank';
import FindDonor from './components/FindDonor';
import RegisterDonor from './components/RegisterDonor';
import MedicalLoans from './components/MedicalLoans';
import LoanForm from './components/LoanForm';
import MedicalInsurance from './components/MedicalInsurance';
import Vaccines from './components/Vaccines';
import MaternalCare from './components/MaternalCare';
import ChildCare from './components/ChildCare';
import MedicineDelivery from './components/User/MedicineOrder/MedicineDelivery';
import Physiotherapy from './components/Physiotherapy';
import HospitalBedBooking from './components/User/Hospital/HospitalBedBooking';
import BookHospitalBed from './components/User/Hospital/BookHospitalBed';
import HospitalResults from './components/HospitalResults';
import CareAtHome from './components/CareAtHome';
import MedicalTourism from './components/MedicalTourism';
import Rehabilitation from './components/Rehabilitation';
import EarlyDetection from './components/EarlyDetection';
import Nutrition from './components/Nutrition';
import PetCare from './components/PetCare';
import OrganDonation from './components/OrganDonation';
import Ayurveda from './components/Ayurveda';
import CheckoutProducts from './components/User/Cart/checkoutproductmedicine';
import CheckoutDelivery from './components/checkoutdelivery';
import CheckoutAmbulance from './components/checkoutambulance';
import PaymentGateway from './components/PaymentGateway';
import UserProfile from './components/User/UserProfile/UserProfile';
import BottomNavigation from './components/BottomNavigation';
import ProductList from './components/User/Products/ProductList';
import TrackOrder from './components/User/TrackOrder/TrackOrder';
import OrderHistory from './components/User/OrderHistory/OrderHistory';
import BookLabTestAppt from './components/User/LabTest/BookLabTestAppt';
import OfflineDoctorConsultation from './components/User/DoctorConsultation/OfflineDoctorConsultation';
import OnlineDoctorConsultation from './components/User/DoctorConsultation/OnlineDoctorConsultation';
import BookOfflineAppointment from './components/User/DoctorConsultation/BookDoctorAppointment';
import HealthRecords from './components/User/HealthRecords/HealthRecords';
import ProductVendorOrders from './components/Vendors/ProductVendor/ProductVendorOrders';

import { isAuthenticated as checkAuth } from './services/User/Auth/auth.utils';
import { vendorAuthService } from './services/User/VendorAuth/vendor-auth.service';
import Logo from './components/ui/Logo';
import ProductPartnerVendorProfile from './components/Vendors/ProductVendor/ProductPartnerVendorProfile';

// Component to handle route-based SignIn display
const AppContent = ({ isAuthenticated, onAuthChange, userType }) => {
  const location = useLocation();
  const [showSignInPanel, setShowSignInPanel] = useState(false);
  const [shouldShowSignInForProtectedRoute, setShouldShowSignInForProtectedRoute] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  console.log('🎭 AppContent initial render - showSignInPanel:', showSignInPanel);

  console.log('📍 Current location:', location.pathname);
  console.log('🔐 Is authenticated:', isAuthenticated);

  // Check if current path is a protected route
  const isProtectedRoute = (path) => {
    const protectedPaths = [
      '/doctor-profile', '/search', '/doctor-consultation', '/checkout', '/ambulance', 
      '/offers', '/membership', '/lab-tests', '/blood-bank', '/find-donor', 
      '/register-donor', '/medical-loans', '/loan-form', '/insurance', 
      '/vaccines', '/maternal-care', '/child-care', '/delivery', '/physiotherapy', 
      '/hospital-bed-booking', '/hospital-results', '/care-at-home', '/medical-tourism', 
      '/rehabilitation', '/early-detection', '/nutrition', '/pet-care', 
      '/organ-donation', '/ayurveda', '/checkout-2', '/checkout-3', '/checkout-4', 
      '/checkout-product-medicine', '/gateway', '/profile', '/orders', '/order-history', '/track-order',
      '/health-records'
    ];
    const isProtected = protectedPaths.some(protectedPath => path.startsWith(protectedPath));
    console.log('🛡️ Route protection check:', { path, isProtected });
    return isProtected;
  };

  // Check if we should show SignIn panel for protected route access
  useEffect(() => {
    console.log('🔍 Checking route protection for:', location.pathname);
    if (!isAuthenticated && isProtectedRoute(location.pathname)) {
      console.log('🚨 Showing SignIn panel for protected route');
      setShouldShowSignInForProtectedRoute(true);
    } else {
      console.log('✅ Route access allowed or not protected');
      setShouldShowSignInForProtectedRoute(false);
    }
  }, [location.pathname, isAuthenticated]);

  // Redirect vendors to their dashboard if they're on home page
  useEffect(() => {
    if (isAuthenticated && userType === 'vendor' && location.pathname === '/') {
      const vendorAuthData = vendorAuthService.getVendorAuthData();
      if (vendorAuthData && vendorAuthData.vendorData) {
        const dashboardRoute = vendorAuthService.getVendorDashboardRoute(vendorAuthData.vendorData.vendorRole);
        console.log('🔄 Redirecting vendor to dashboard:', dashboardRoute);
        window.location.href = dashboardRoute;
      }
    }
  }, [isAuthenticated, userType, location.pathname]);

  // Re-verify authentication when isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated && !userType) {
      // Check if it's a vendor authentication
      const vendorAuthData = vendorAuthService.getVendorAuthData();
      if (vendorAuthData && vendorAuthData.userType === 'vendor') {
        console.log('🔍 Re-verifying vendor authentication in AppContent');
        // This will trigger the parent component to update userType
        onAuthChange(true);
      }
    }
  }, [isAuthenticated, userType, onAuthChange]);

  // Check for vendor authentication on every render to ensure immediate detection
  useEffect(() => {
    const vendorAuthData = vendorAuthService.getVendorAuthData();
    if (vendorAuthData && vendorAuthData.userType === 'vendor' && userType !== 'vendor') {
      console.log('🔍 Immediate vendor authentication check - updating userType');
      onAuthChange(true);
    }
    
    // Mark authentication as verified after a brief delay
    const timer = setTimeout(() => {
      setIsAuthVerified(true);
    }, 100);
    
    return () => clearTimeout(timer);
  });

  const handleShowSignIn = () => {
    console.log('🎯 handleShowSignIn called');
    console.log('📊 Current state - showSignInPanel:', showSignInPanel);
    setShowSignInPanel(true);
    console.log('✅ showSignInPanel set to true');
  };

  // Debug state changes
  useEffect(() => {
    console.log('🔄 showSignInPanel state changed to:', showSignInPanel);
    console.log('🔄 shouldShowSignInForProtectedRoute state changed to:', shouldShowSignInForProtectedRoute);
    console.log('🔄 Combined isOpen value:', showSignInPanel || shouldShowSignInForProtectedRoute);
  }, [showSignInPanel, shouldShowSignInForProtectedRoute]);

  const handleCloseSignIn = () => {
    console.log('🎯 handleCloseSignIn called');
    console.log('📊 Current state before close - showSignInPanel:', showSignInPanel);
    setShowSignInPanel(false);
    setShouldShowSignInForProtectedRoute(false);
    console.log('✅ showSignInPanel set to false');
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

  return (
    <div className="app">
      {console.log('🎭 AppContent render - userType:', userType, 'isAuthenticated:', isAuthenticated, 'isAuthVerified:', isAuthVerified)}
      {userType !== 'vendor' && isAuthVerified && (
        <Header 
          isAuthenticated={isAuthenticated} 
          onAuthChange={onAuthChange} 
          onShowSignIn={handleShowSignIn} 
        />
      )}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            userType === 'vendor' ? <Navigate to="/vendor/product-partner/dashboard" replace /> : <Home />
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductProfilePage />} />
          <Route path="/products/:category" element={<ProductList />} />

          {/* Protected Routes */}
          <Route path="/doctor-profile/:id" element={
            isAuthenticated ? <DoctorProfile /> : <Navigate to="/" replace />
          } />
          <Route path="/search" element={
            isAuthenticated ? <SearchResults /> : <Navigate to="/" replace />
          } />
          <Route path="/doctor-consultation" element={
            isAuthenticated ? <ConsultDoctors /> : <Navigate to="/" replace />
          } />
          <Route path="/doctor-consultation/offline" element={
            isAuthenticated ? <OfflineDoctorConsultation /> : <Navigate to="/" replace />
          } />
          <Route path="/doctor-consultation/online" element={
            isAuthenticated ? <OnlineDoctorConsultation /> : <Navigate to="/" replace />
          } />
          <Route path="/doctor-consultation/offline/book/:vendorId" element={
            isAuthenticated ? <BookOfflineAppointment /> : <Navigate to="/" replace />
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
          <Route path="/lab-tests/book/:labId" element={
            isAuthenticated ? <BookLabTestAppt /> : <Navigate to="/" replace />
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
          <Route path="/medicine-order" element={
            isAuthenticated ? <MedicineDelivery /> : <Navigate to="/" replace />
          } />
          <Route path="/physiotherapy" element={
            isAuthenticated ? <Physiotherapy /> : <Navigate to="/" replace />
          } />
          <Route path="/hospital-bed-booking" element={
            isAuthenticated ? <HospitalBedBooking /> : <Navigate to="/" replace />
          } />
          <Route path="/hospital-bed-booking/:vendorId" element={
            isAuthenticated ? <BookHospitalBed /> : <Navigate to="/" replace />
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
          <Route path="/checkout-product-medicine" element={
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
            isAuthenticated ? <OrderHistory /> : <Navigate to="/" replace />
          } />
          <Route path="/order-history" element={
            isAuthenticated ? <OrderHistory /> : <Navigate to="/" replace />
          } />
          <Route path="/track-order" element={
            isAuthenticated ? <TrackOrder /> : <Navigate to="/" replace />
          } />
          <Route path="/health-records" element={
            isAuthenticated ? <HealthRecords /> : <Navigate to="/" replace />
          } />

          {/* Vendor Routes */}
          <Route path="/vendor/product-partner/dashboard" element={<ProductVendorDashboard />} />
          <Route path="/vendor/product-partner/products" element={<ProductVendorProducts />} />
          <Route path="/vendor/product-partner/profile" element={<ProductPartnerVendorProfile />} />
          <Route path="/vendor/product-partner/orders" element={<ProductVendorOrders />} />
          <Route path="/vendor/hospital/dashboard" element={<HospitalVendorDashboard />} />
          <Route path="/vendor/clinic/dashboard" element={<DoctorConsultationVendorDashboard />} />
          <Route path="/vendor/pharmacy/dashboard" element={<MedicalStoreVendorDashboard />} />
          <Route path="/vendor/ambulance/dashboard" element={<AmbulanceVendorDashboard />} />
          <Route path="/vendor/blood-bank/dashboard" element={<BloodBankVendorDashboard />} />
          <Route path="/vendor/lab-test/dashboard" element={<LabTestVendorDashboard />} />
          <Route path="/vendor/delivery-partner/dashboard" element={<DeliveryPartnerVendorDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SignIn 
        isOpen={showSignInPanel || shouldShowSignInForProtectedRoute} 
        onClose={handleCloseSignIn}
        onAuthChange={handleAuthChange}
      />
      {console.log('🎭 SignIn component render state:', {
        showSignInPanel,
        shouldShowSignInForProtectedRoute,
        isOpen: showSignInPanel || shouldShowSignInForProtectedRoute
      })}
      {console.log('🎭 About to render SignIn component with isOpen:', showSignInPanel || shouldShowSignInForProtectedRoute)}
      {userType !== 'vendor' && isAuthVerified && (
        <>
          <BottomNavigation />
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      setIsLoading(true);
      // Small delay to ensure localStorage is accessible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check for vendor authentication first
      const vendorAuthData = vendorAuthService.getVendorAuthData();
      if (vendorAuthData && vendorAuthData.userType === 'vendor') {
        console.log('🔍 Vendor authenticated:', vendorAuthData.vendorData);
        setIsAuthenticated(true);
        setUserType('vendor');
        return;
      }
      
      // Check for user authentication
      const authState = await checkAuth();
      console.log('🔍 User auth verification result:', authState);
      setIsAuthenticated(authState);
      setUserType(authState ? 'user' : null);
    } catch (error) {
      console.error('❌ Error verifying auth:', error);
      setIsAuthenticated(false);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthChange = (authState) => {
    console.log("🔄 App level auth state changed:", authState);
    setIsAuthenticated(authState);
    
    // If authentication is successful, check if it's a vendor
    if (authState) {
      const vendorAuthData = vendorAuthService.getVendorAuthData();
      if (vendorAuthData && vendorAuthData.userType === 'vendor') {
        console.log('🔍 Vendor authenticated in handleAuthChange:', vendorAuthData.vendorData);
        setUserType('vendor');
      } else {
        setUserType('user');
      }
    } else {
      setUserType(null);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider theme={healthcareTheme}>
        <CssBaseline />
        <div className="loading-screen">
          <div className="loading-container">
            {/* Logo */}
            <div className="loading-logo">
              <Logo size="regular" />
            </div>
            {/* Loading Text */}
            <div className="loading-content">
              <h2 className="loading-title">Vedika.health</h2>
              <p className="loading-subtitle">Your trusted healthcare partner</p>
              {/* Animated Loading Dots */}
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="loading-status">Initializing your healthcare experience...</p>
            </div>
            {/* Healthcare Icons Animation */}
            <div className="healthcare-icons">
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={healthcareTheme}>
      <CssBaseline />
      <Router>
        <div className="app">
          {console.log('🎭 App render - userType:', userType, 'isAuthenticated:', isAuthenticated)}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <AppContent
            isAuthenticated={isAuthenticated}
            onAuthChange={handleAuthChange}
            userType={userType}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
