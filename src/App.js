import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopLayout from './DesktopLayout';  // Main desktop UI
import MobileLayout from './MobileLayout';    // Mobile-specific UI
import SearchResults from './components/SearchResults';
import DoctorProfile from './components/DoctorProfile'; 
import SignIn from './components/SignIn';
import Checkout from './components/Checkout';
import Products from './components/Products';
import ProductProfilePage from './components/ProductsProfile';
import Ambulance from './components/Ambulance';
import Offers from './components/Offers';
import Membership from './components/Membership';
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

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Router>
            <Routes>
                {isMobile ? (
                    <Route path="*" element={<MobileLayout />} /> // Show mobile UI
                ) : (
                    <Route path="*" element={<DesktopLayout />} /> // Show desktop UI
                )}
                    <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
                    <Route path="/product/:id" element={<ProductProfilePage />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/doctors" element={<ConsultDoctors />} />
                    <Route path="/signin" element={<SignIn />} />
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
            </Routes>
        </Router>
    );
}

export default App;
