import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import healthcareTheme from './theme/healthcareTheme';

import Header from './components/User/header/Header';
import Footer from './components/Footer';

import Login from './components/Login';
import ProductVendorDashboard from './components/Vendors/ProductVendor/ProductVendorDashboard';
import ProductVendorProducts from './components/Vendors/ProductVendor/ProductVendorProducts';
import HospitalVendorDashboard from './components/Vendors/HospitalVendor/HospitalVendorDashboard';
import HospitalVendorWards from './components/Vendors/HospitalVendor/HospitalVendorWards';
import HospitalVendorAppointments from './components/Vendors/HospitalVendor/HospitalVendorAppointments';
import HospitalVendorHistory from './components/Vendors/HospitalVendor/HospitalVendorHistory';
import HospitalVendorProfile from './components/Vendors/HospitalVendor/HospitalVendorProfile';
import HospitalVendorEditProfile from './components/Vendors/HospitalVendor/HospitalVendorEditProfile';
import HospitalVendorSettings from './components/Vendors/HospitalVendor/HospitalVendorSettings';
import DoctorConsultationVendorDashboard from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorDashboard';
import DoctorConsultationVendorLayout from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorLayout';
import DoctorConsultationVendorAppointments from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorAppointments';
import DoctorConsultationVendorHistory from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorHistory';
import DoctorConsultationVendorProfile from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorProfile';
import DoctorConsultationVendorEditProfile from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorEditProfile';
import DoctorConsultationVendorSettings from './components/Vendors/DoctorConsultationVendor/DoctorConsultationVendorSettings';
import MedicalStoreVendorDashboard from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorDashboard';
import AmbulanceVendorDashboard from './components/Vendors/AmbulanceVendor/AmbulanceVendorDashboard';
import AmbulanceVendorRequests from './components/Vendors/AmbulanceVendor/AmbulanceVendorRequests';
import AmbulanceVendorHistory from './components/Vendors/AmbulanceVendor/AmbulanceVendorHistory';
import AmbulanceVendorProfile from './components/Vendors/AmbulanceVendor/AmbulanceVendorProfile';
import AmbulanceVendorSettings from './components/Vendors/AmbulanceVendor/AmbulanceVendorSettings';
import AmbulanceVendorProcessOrder from './components/Vendors/AmbulanceVendor/AmbulanceVendorProcessOrder';
import BloodBankVendorDashboard from './components/Vendors/BloodBankVendor/BloodBankVendorDashboard';
import BloodBankVendorAvailability from './components/Vendors/BloodBankVendor/BloodBankVendorAvailability';
import BloodBankVendorRequests from './components/Vendors/BloodBankVendor/BloodBankVendorRequests';
import BloodBankVendorHistory from './components/Vendors/BloodBankVendor/BloodBankVendorHistory';
import BloodBankVendorProfile from './components/Vendors/BloodBankVendor/BloodBankVendorProfile';
import BloodBankVendorEditProfile from './components/Vendors/BloodBankVendor/BloodBankVendorEditProfile';
import BloodBankVendorAnalytics from './components/Vendors/BloodBankVendor/BloodBankVendorAnalytics';
import BloodBankVendorProcessRequest from './components/Vendors/BloodBankVendor/BloodBankVendorProcessRequest';
import LabTestVendorDashboard from './components/Vendors/LabTestVendor/LabTestVendorDashboard';
import DeliveryPartnerVendorDashboard from './components/Vendors/DeliveryPartnerVendor/DeliveryPartnerVendorDashboard';

import Products from './components/User/Products/Products';
import Ambulance from './components/User/Ambulance/Ambulance';
import Membership from './components/Membership';
import Home from './components/User/Home/Home';
import ConsultDoctors from './components/User/DoctorConsultation/ConsultDoctors';
import LabTests from './components/User/LabTest/LabTests';
import BloodBank from './components/User/BloodBank/BloodBank';
import MedicineDelivery from './components/User/MedicineOrder/MedicineDelivery';
import NewMedicineOrder from './components/User/NewMedicineOrder';
import HospitalBedBooking from './components/User/Hospital/HospitalBedBooking';
import BookHospitalBed from './components/User/Hospital/BookHospitalBed';
import CheckoutProducts from './components/User/Cart/checkoutproductmedicine';
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
import ProductVendorReports from './components/Vendors/ProductVendor/ProductVendorReports';
import MedicalStoreVendorReports from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorReports';
import MedicalStoreVendorAnalysis from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorAnalysis';
import MedicalStoreVendorOrders from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorOrders';
import MedicalStoreVendorLayout from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorLayout';
import MedicalStoreVendorProducts from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorProducts';
import MedicalStoreVendorProfile from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorProfile';
import MedicalStoreVendorReturns from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorReturns';
import MedicalStoreVendorSettings from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorSettings';
import MedicalStoreVendorProcessOrderPage from './components/Vendors/MedicalStoreVendor/MedicalStoreVendorProcessOrderPage';
import { VendorThemeProvider } from './contexts/VendorThemeContext';

import { isAuthenticated as checkAuth } from './services/User/Auth/auth.utils';
import { vendorAuthService } from './services/Vendors/VendorAuth/vendor-auth.service';
import Logo from './components/ui/Logo';
import ProductPartnerVendorProfile from './components/Vendors/ProductVendor/ProductPartnerVendorProfile';
import HealthBlogs from './components/User/HealthBlogs/HealthBlogs';
import BlogDetail from './components/User/HealthBlogs/BlogDetail';

// Component to handle route-based authentication display
const AppContent = ({ isAuthenticated, onAuthChange, userType, isLoading }) => {
  const location = useLocation();
  const [isAuthVerified, setIsAuthVerified] = useState(false);



  console.log('📍 Current location:', location.pathname);
  console.log('🔐 Is authenticated:', isAuthenticated);





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
    
    // Mark authentication as verified immediately for smooth transition
    setIsAuthVerified(true);
  }, [userType, onAuthChange]);





  // Show login screen if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="app">
        <Login onAuthChange={onAuthChange} />
      </div>
    );
  }

  return (
    <div className="app">
      {console.log('🎭 AppContent render - userType:', userType, 'isAuthenticated:', isAuthenticated, 'isAuthVerified:', isAuthVerified)}
      {userType !== 'vendor' && (
        <Header 
          isAuthenticated={isAuthenticated} 
          onAuthChange={onAuthChange} 
        />
      )}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            userType === 'vendor' ? (() => {
              const vendorAuthData = vendorAuthService.getVendorAuthData();
              if (vendorAuthData && vendorAuthData.vendorData) {
                const dashboardRoute = vendorAuthService.getVendorDashboardRoute(vendorAuthData.vendorData.vendorRole);
                console.log('🔄 Vendor redirect - Role:', vendorAuthData.vendorData.vendorRole, 'Route:', dashboardRoute);
                return <Navigate to={dashboardRoute} replace />;
              }
              console.log('🔄 Vendor redirect - No vendor data, using fallback');
              return <Navigate to="/vendor/product-partner/dashboard" replace />;
            })() : <Home />
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductList />} />

          {/* Protected Routes */}
          <Route path="/doctor-consultation" element={<ConsultDoctors />} />
          <Route path="/doctor-consultation/offline" element={<OfflineDoctorConsultation />} />
          <Route path="/doctor-consultation/online" element={<OnlineDoctorConsultation />} />
          <Route path="/doctor-consultation/offline/book/:vendorId" element={<BookOfflineAppointment />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/lab-tests/book/:labId" element={<BookLabTestAppt />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route path="/medicine-order" element={<MedicineDelivery />} />
          <Route path="/new-medicine-order" element={<NewMedicineOrder />} />
          <Route path="/hospital-bed-booking" element={<HospitalBedBooking />} />
          <Route path="/hospital-bed-booking/:vendorId" element={<BookHospitalBed />} />
          <Route path="/checkout-product-medicine" element={<CheckoutProducts />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/health-blogs" element={<HealthBlogs />} />
          <Route path="/health-blogs/:id" element={<BlogDetail />} />

          {/* Vendor Routes */}
          <Route path="/vendor/product-partner/dashboard" element={<ProductVendorDashboard />} />
          <Route path="/vendor/product-partner/products" element={<ProductVendorProducts />} />
          <Route path="/vendor/product-partner/profile" element={<ProductPartnerVendorProfile />} />
          <Route path="/vendor/product-partner/orders" element={<ProductVendorOrders />} />
          <Route path="/vendor/product-partner/reports" element={<ProductVendorReports />} />
          <Route path="/vendor/hospital/dashboard" element={<HospitalVendorDashboard />} />
          <Route path="/vendor/hospital/wards" element={
            <VendorThemeProvider>
              <HospitalVendorWards />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/hospital/appointments" element={
            <VendorThemeProvider>
              <HospitalVendorAppointments />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/hospital/history" element={
            <VendorThemeProvider>
              <HospitalVendorHistory />
            </VendorThemeProvider>
          } />
                      <Route path="/vendor/hospital/profile" element={
              <VendorThemeProvider>
                <HospitalVendorProfile />
              </VendorThemeProvider>
            } />
            <Route path="/vendor/hospital/edit-profile" element={
              <VendorThemeProvider>
                <HospitalVendorEditProfile />
              </VendorThemeProvider>
            } />
            <Route path="/vendor/hospital/settings" element={
              <VendorThemeProvider>
                <HospitalVendorSettings />
              </VendorThemeProvider>
            } />
          <Route path="/vendor/doctor-consultation/dashboard" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="Dashboard">
                <DoctorConsultationVendorDashboard />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/doctor-consultation/appointments" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="Appointments">
                <DoctorConsultationVendorAppointments />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/doctor-consultation/history" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="History">
                <DoctorConsultationVendorHistory />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/doctor-consultation/profile" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="Profile">
                <DoctorConsultationVendorProfile />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/doctor-consultation/edit-profile" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="Edit Profile">
                <DoctorConsultationVendorEditProfile />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/doctor-consultation/settings" element={
            <VendorThemeProvider>
              <DoctorConsultationVendorLayout title="Settings">
                <DoctorConsultationVendorSettings />
              </DoctorConsultationVendorLayout>
            </VendorThemeProvider>
          } />
          
          {/* Legacy clinic routes - redirect to doctor-consultation */}
          <Route path="/vendor/clinic/dashboard" element={<Navigate to="/vendor/doctor-consultation/dashboard" replace />} />
          <Route path="/vendor/clinic/appointments" element={<Navigate to="/vendor/doctor-consultation/appointments" replace />} />
          <Route path="/vendor/clinic/history" element={<Navigate to="/vendor/doctor-consultation/history" replace />} />
          <Route path="/vendor/clinic/profile" element={<Navigate to="/vendor/doctor-consultation/profile" replace />} />
          <Route path="/vendor/clinic/settings" element={<Navigate to="/vendor/doctor-consultation/settings" replace />} />
          <Route path="/vendor/pharmacy/dashboard" element={<MedicalStoreVendorDashboard />} />
          <Route path="/vendor/pharmacy/reports" element={<MedicalStoreVendorReports />} />
          <Route path="/vendor/pharmacy/analysis" element={<MedicalStoreVendorAnalysis />} />
          <Route path="/vendor/pharmacy/orders" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Orders">
                <MedicalStoreVendorOrders />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/pharmacy/products" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Products">
                <MedicalStoreVendorProducts />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/pharmacy/profile" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Profile">
                <MedicalStoreVendorProfile />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/pharmacy/returns" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Returns">
                <MedicalStoreVendorReturns />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/pharmacy/settings" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Settings">
                <MedicalStoreVendorSettings />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/pharmacy/process-order/:orderId" element={
            <VendorThemeProvider>
              <MedicalStoreVendorLayout title="Process Order">
                <MedicalStoreVendorProcessOrderPage />
              </MedicalStoreVendorLayout>
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/dashboard" element={
            <VendorThemeProvider>
              <AmbulanceVendorDashboard />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/requests" element={
            <VendorThemeProvider>
              <AmbulanceVendorRequests />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/history" element={
            <VendorThemeProvider>
              <AmbulanceVendorHistory />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/profile" element={
            <VendorThemeProvider>
              <AmbulanceVendorProfile />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/settings" element={
            <VendorThemeProvider>
              <AmbulanceVendorSettings />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/ambulance/process-order/:requestId" element={
            <VendorThemeProvider>
              <AmbulanceVendorProcessOrder />
            </VendorThemeProvider>
          } />
          <Route path="/vendor/blood-bank/dashboard" element={<BloodBankVendorDashboard />} />
          <Route path="/vendor/blood-bank/availability" element={<BloodBankVendorAvailability />} />
          <Route path="/vendor/blood-bank/requests" element={<BloodBankVendorRequests />} />
          <Route path="/vendor/blood-bank/history" element={<BloodBankVendorHistory />} />
          <Route path="/vendor/blood-bank/analytics" element={<BloodBankVendorAnalytics />} />
          <Route path="/vendor/blood-bank/profile" element={<BloodBankVendorProfile />} />
          <Route path="/vendor/blood-bank/edit-profile" element={<BloodBankVendorEditProfile />} />
          <Route path="/vendor/blood-bank/process-request/:bookingId" element={<BloodBankVendorProcessRequest />} />
          <Route path="/vendor/lab-test/dashboard" element={<LabTestVendorDashboard />} />
          <Route path="/vendor/delivery-partner/dashboard" element={<DeliveryPartnerVendorDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {userType !== 'vendor' && (
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
        console.log('🔍 Vendor authenticated:', vendorAuthData.token);
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
        <div className="loading-screen fade-in">
          <div className="loading-container">
            {/* Animated Background */}
            <div className="loading-background">
              <div className="gradient-circle circle-1"></div>
              <div className="gradient-circle circle-2"></div>
              <div className="gradient-circle circle-3"></div>
            </div>
            
            {/* Main Content */}
            <div className="loading-content-wrapper">
              {/* Logo with Pulse Animation */}
              <div className="loading-logo-container">
                <div className="logo-pulse-ring"></div>
                <div className="loading-logo">
                  <Logo size="regular" />
                </div>
              </div>
              
              {/* Title with Typing Effect */}
              <div className="loading-title-container">
                <h2 className="loading-title">
                  <span className="title-char">V</span>
                  <span className="title-char">e</span>
                  <span className="title-char">d</span>
                  <span className="title-char">i</span>
                  <span className="title-char">k</span>
                  <span className="title-char">a</span>
                  <span className="title-char">.</span>
                  <span className="title-char">h</span>
                  <span className="title-char">e</span>
                  <span className="title-char">a</span>
                  <span className="title-char">l</span>
                  <span className="title-char">t</span>
                  <span className="title-char">h</span>
                </h2>
              </div>
              
              {/* Subtitle with Fade In */}
              <p className="loading-subtitle">Your trusted healthcare partner</p>
              
              {/* Modern Loading Bar */}
              <div className="loading-bar-container">
                <div className="loading-bar">
                  <div className="loading-progress"></div>
                </div>
                <div className="loading-percentage">0%</div>
              </div>
              
              {/* Status Text with Rotating Messages */}
              <div className="loading-status-container">
                <p className="loading-status">Initializing your healthcare experience...</p>
              </div>
              
              {/* Floating Healthcare Icons */}
              <div className="healthcare-icons">
                <div className="icon-item icon-heart">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="icon-item icon-activity">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="icon-item icon-layers">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="icon-item icon-plus">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            overflow: hidden;
            animation: fadeIn 0.5s ease-out;
          }
          
          .fade-in {
            animation: fadeIn 0.5s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .loading-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .loading-background {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .gradient-circle {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            animation: float 6s ease-in-out infinite;
          }
          
          .circle-1 {
            width: 200px;
            height: 200px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }
          
          .circle-2 {
            width: 150px;
            height: 150px;
            top: 60%;
            right: 15%;
            animation-delay: 2s;
          }
          
          .circle-3 {
            width: 100px;
            height: 100px;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          .loading-content-wrapper {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
            max-width: 500px;
            padding: 2rem;
          }
          
          .loading-logo-container {
            position: relative;
            display: inline-block;
            margin-bottom: 2rem;
          }
          
          .logo-pulse-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
          }
          
          .loading-logo {
            position: relative;
            z-index: 2;
          }
          
          .loading-title-container {
            margin-bottom: 1rem;
          }
          
          .loading-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: 2px;
          }
          
          .title-char {
            display: inline-block;
            opacity: 0;
            animation: typeChar 0.1s ease-in-out forwards;
          }
          
          .title-char:nth-child(1) { animation-delay: 0.1s; }
          .title-char:nth-child(2) { animation-delay: 0.2s; }
          .title-char:nth-child(3) { animation-delay: 0.3s; }
          .title-char:nth-child(4) { animation-delay: 0.4s; }
          .title-char:nth-child(5) { animation-delay: 0.5s; }
          .title-char:nth-child(6) { animation-delay: 0.6s; }
          .title-char:nth-child(7) { animation-delay: 0.7s; }
          .title-char:nth-child(8) { animation-delay: 0.8s; }
          .title-char:nth-child(9) { animation-delay: 0.9s; }
          .title-char:nth-child(10) { animation-delay: 1.0s; }
          .title-char:nth-child(11) { animation-delay: 1.1s; }
          .title-char:nth-child(12) { animation-delay: 1.2s; }
          .title-char:nth-child(13) { animation-delay: 1.3s; }
          
          @keyframes typeChar {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .loading-subtitle {
            font-size: 1.2rem;
            margin: 1rem 0 2rem 0;
            opacity: 0;
            animation: fadeInUp 0.5s ease-out 1.5s forwards;
            font-weight: 300;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .loading-bar-container {
            margin: 2rem 0;
            opacity: 0;
            animation: fadeInUp 0.5s ease-out 2s forwards;
          }
          
          .loading-bar {
            width: 300px;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto 1rem auto;
            position: relative;
          }
          
          .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #fff, #e0e7ff);
            border-radius: 3px;
            width: 0%;
            animation: progress 3s ease-in-out infinite;
            position: relative;
          }
          
          .loading-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s ease-in-out infinite;
          }
          
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .loading-percentage {
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 0.8;
            animation: countUp 3s ease-in-out infinite;
          }
          
          @keyframes countUp {
            0% { content: "0%"; }
            50% { content: "70%"; }
            100% { content: "100%"; }
          }
          
          .loading-status-container {
            margin: 1.5rem 0;
            opacity: 0;
            animation: fadeInUp 0.5s ease-out 2.5s forwards;
          }
          
          .loading-status {
            font-size: 1rem;
            margin: 0;
            opacity: 0.9;
            font-weight: 400;
          }
          
          .healthcare-icons {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 3rem;
            opacity: 0;
            animation: fadeInUp 0.5s ease-out 3s forwards;
          }
          
          .icon-item {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            animation: floatIcon 3s ease-in-out infinite;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          .icon-item:nth-child(1) { animation-delay: 0s; }
          .icon-item:nth-child(2) { animation-delay: 0.5s; }
          .icon-item:nth-child(3) { animation-delay: 1s; }
          .icon-item:nth-child(4) { animation-delay: 1.5s; }
          
          @keyframes floatIcon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          
          .icon-item:hover {
            transform: scale(1.1);
            transition: transform 0.3s ease;
          }
          
          @media (max-width: 768px) {
            .loading-title {
              font-size: 2rem;
              letter-spacing: 1px;
            }
            
            .loading-subtitle {
              font-size: 1rem;
            }
            
            .loading-bar {
              width: 250px;
            }
            
            .healthcare-icons {
              gap: 1rem;
            }
            
            .icon-item {
              width: 50px;
              height: 50px;
            }
          }
          
          .fade-in-content {
            animation: fadeInContent 0.8s ease-out;
          }
          
          @keyframes fadeInContent {
            from { 
              opacity: 0; 
              transform: translateY(20px);
            }
            to { 
              opacity: 1; 
              transform: translateY(0);
            }
          }
        `}</style>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={healthcareTheme}>
      <CssBaseline />
      <Router>
        <div className="app fade-in-content">
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
            isLoading={isLoading}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
