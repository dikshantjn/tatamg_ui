import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./secondary/Header";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import ConsultDoctors from "./components/ConsultDoctors";
import LabTests from "./components/LabTests";
import BloodBank from "./components/BloodBank";
import FindDonor from "./components/FindDonor";
import RegisterDonor from "./components/RegisterDonor";
import MedicalLoans from "./components/MedicalLoans";
import LoanForm from "./components/LoanForm";
import MedicalInsurance from "./components/MedicalInsurance";
import Vaccines from "./components/Vaccines";
import MaternalCare from "./components/MaternalCare";
import ChildCare from "./components/ChildCare";
import MedicineDelivery from "./components/MedicineDelivery";
import Physiotherapy from "./components/Physiotherapy";
import HospitalDiscovery from "./components/HospitalDiscovery";
import HospitalResults from "./components/HospitalResults";
import CareAtHome from "./components/CareAtHome";
import MedicalTourism from "./components/MedicalTourism";
import Rehabilitation from "./components/Rehabilitation";
import EarlyDetection from "./components/EarlyDetection";
import Nutrition from "./components/Nutrition";
import PetCare from "./components/PetCare";
import OrganDonation from "./components/OrganDonation";
import Ayurveda from "./components/Ayurveda";
import CheckoutProducts from "./components/checkoutproduct";
import CheckoutDelivery from "./components/checkoutdelivery";
import CheckoutAmbulance from "./components/checkoutambulance";
import PaymentGateway from "./components/PaymentGateway";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Sync authentication state with localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  // Listen for logout across multiple tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/signin"; // Hide header and footer on sign-in page

  return (
    <div className="App">
      {!hideHeaderFooter && <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
      <main>
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/doctors" element={<ConsultDoctors />} />
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
              <Route path="/hospital-discovery" element={<HospitalDiscovery />} />
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
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/signin" />} />
          )}
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
